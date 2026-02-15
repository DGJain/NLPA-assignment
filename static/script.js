// script.js
document.addEventListener('DOMContentLoaded', () => {
    const textTab = document.querySelector('[data-tab="text-input"]');
    const fileTab = document.querySelector('[data-tab="file-upload"]');
    const textContent = document.getElementById('text-input');
    const fileContent = document.getElementById('file-upload');
    const analyzeBtn = document.getElementById('analyzeBtn');
    const fileInput = document.getElementById('filePayload');
    const dropArea = document.getElementById('dropArea');
    const fileNameDisplay = document.getElementById('fileName');
    const loading = document.getElementById('loading');
    const resultSection = document.getElementById('result');

    // Tab Switching
    textTab.addEventListener('click', () => switchTab('text'));
    fileTab.addEventListener('click', () => switchTab('file'));

    function switchTab(mode) {
        if (mode === 'text') {
            textTab.classList.add('active');
            fileTab.classList.remove('active');
            textContent.classList.add('active');
            fileContent.classList.remove('active');
        } else {
            fileTab.classList.add('active');
            textTab.classList.remove('active');
            fileContent.classList.add('active');
            textContent.classList.remove('active');
        }
        // Hide previous results when switching
        resultSection.classList.add('hidden'); 
    }

    // File Upload Handling
    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            fileNameDisplay.textContent = e.target.files[0].name;
            dropArea.classList.add('dragover');
        }
    });

    dropArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropArea.classList.add('dragover');
    });

    dropArea.addEventListener('dragleave', () => {
        dropArea.classList.remove('dragover');
    });

    dropArea.addEventListener('drop', (e) => {
        e.preventDefault();
        dropArea.classList.remove('dragover');
        if (e.dataTransfer.files.length > 0) {
            fileInput.files = e.dataTransfer.files;
            fileNameDisplay.textContent = e.dataTransfer.files[0].name;
            // Switch to file tab if not active? Actually we are already there if dropping.
        }
    });

    // Analyze Button Logic
    analyzeBtn.addEventListener('click', async () => {
        const isTextMode = textTab.classList.contains('active');
        const formData = new FormData();

        if (isTextMode) {
            const text = document.getElementById('textPayload').value.trim();
            if (!text) {
                alert('Please enter some text to analyze.');
                return;
            }
            formData.append('text', text);
        } else {
            if (fileInput.files.length === 0) {
                alert('Please upload a text file.');
                return;
            }
            formData.append('file', fileInput.files[0]);
        }

        // UI State: Loading
        loading.classList.remove('hidden');
        resultSection.classList.add('hidden');
        analyzeBtn.disabled = true;

        try {
            const response = await fetch('/analyze', {
                method: 'POST',
                body: formData
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Analysis failed');
            }

            displayResults(data);
        } catch (error) {
            alert(error.message);
        } finally {
            loading.classList.add('hidden');
            analyzeBtn.disabled = false;
        }
    });

    let sentimentChart;

    function displayResults(data) {
        resultSection.classList.remove('hidden');

        // Summary: label + strength badge, summary sentence, text stats
        const labelEl = document.getElementById('sentimentLabel');
        const labelText = (data.label === 'Mixed') ? 'Mixed' : (data.strength ? `${data.strength} ${data.label}` : data.label);
        labelEl.textContent = labelText;
        labelEl.className = `sentiment-badge ${data.label}`;

        document.getElementById('summaryText').textContent = data.summary || '';

        const clarityVal = document.getElementById('clarityValue');
        const clarityLine = document.getElementById('clarityLine');
        if (data.sentiment_clarity) {
            clarityVal.textContent = data.sentiment_clarity;
            clarityLine.classList.remove('hidden');
        } else {
            clarityLine.classList.add('hidden');
        }

        if (data.text_stats) {
            document.getElementById('statWords').textContent = data.text_stats.word_count;
            document.getElementById('statSentences').textContent = data.text_stats.sentence_count;
            document.getElementById('statChars').textContent = data.text_stats.char_count;
        }

        // Score breakdown cards (with tooltips)
        const desc = data.score_descriptions || {};
        const formatScore = (v) => (typeof v === 'number' ? v.toFixed(3) : v);
        document.getElementById('scorePos').textContent = formatScore(data.pos);
        document.getElementById('scoreNeu').textContent = formatScore(data.neu);
        document.getElementById('scoreNeg').textContent = formatScore(data.neg);
        document.getElementById('scoreCompound').textContent = formatScore(data.compound);

        document.querySelectorAll('.score-card').forEach(card => {
            const key = card.getAttribute('data-score');
            card.title = desc[key] || '';
        });

        // Top positive / negative words
        const topPosList = document.getElementById('topPositiveList');
        const topNegList = document.getElementById('topNegativeList');
        if (data.top_positive_words && data.top_positive_words.length) {
            topPosList.innerHTML = data.top_positive_words.map(w =>
                `<li><span class="dw-word">${escapeHtml(w.word)}</span><span class="dw-score">${w.score}</span></li>`
            ).join('');
        } else {
            topPosList.innerHTML = '<li class="dw-empty">No positive words detected in this text.</li>';
        }
        if (data.top_negative_words && data.top_negative_words.length) {
            topNegList.innerHTML = data.top_negative_words.map(w =>
                `<li><span class="dw-word">${escapeHtml(w.word)}</span><span class="dw-score">${w.score}</span></li>`
            ).join('');
        } else {
            topNegList.innerHTML = '<li class="dw-empty">No negative words detected in this text.</li>';
        }

        // Chart
        updateChart(data);

        // Sentence-by-sentence analysis
        const sentenceList = document.getElementById('sentenceList');
        const breakdownEl = document.getElementById('sentenceBreakdown');
        if (data.sentence_sentiments && data.sentence_sentiments.length) {
            breakdownEl.classList.remove('hidden');
            sentenceList.innerHTML = data.sentence_sentiments.map((s, i) => {
                const pos = (s.pos != null) ? s.pos.toFixed(3) : '—';
                const neu = (s.neu != null) ? s.neu.toFixed(3) : '—';
                const neg = (s.neg != null) ? s.neg.toFixed(3) : '—';
                const compound = typeof s.compound === 'number' ? s.compound.toFixed(3) : s.compound;
                return `<li class="sentence-item sentence-${s.label.toLowerCase()}">
                    <span class="sentence-num">${i + 1}</span>
                    <div class="sentence-body">
                        <div class="sentence-text">${escapeHtml(s.text)}</div>
                        <div class="sentence-metrics">
                            <span class="sent-metric sent-pos" title="Positive">Pos ${pos}</span>
                            <span class="sent-metric sent-neu" title="Neutral">Neu ${neu}</span>
                            <span class="sent-metric sent-neg" title="Negative">Neg ${neg}</span>
                            <span class="sent-metric sent-compound" title="Compound">Compound ${compound}</span>
                        </div>
                        <span class="sentence-label-badge">${escapeHtml(s.label)}</span>
                    </div>
                </li>`;
            }).join('');
        } else {
            breakdownEl.classList.add('hidden');
        }

        // Highlights (with negated styling)
        const highlightBox = document.getElementById('highlightedText');
        highlightBox.innerHTML = data.highlighted_tokens.map(token => {
            let className = token.category !== 'neutral' ? `highlight-token highlight-${token.category}` : '';
            if (token.negated) className += ' highlight-negated';
            const title = token.negated ? `Negated. VADER score: ${token.score}` : `VADER score: ${token.score}`;
            return `<span class="${className}" title="${title}">${escapeHtml(token.word)}</span>`;
        }).join(' ');

        // Word stats
        const statsList = document.getElementById('wordStatsList');
        statsList.innerHTML = data.word_stats.map(([word, count]) =>
            `<li><span class="word">${escapeHtml(word)}</span><span class="word-count">${count}</span></li>`
        ).join('');

        document.getElementById('preprocessedText').textContent = data.preprocessed_text;
    }

    function escapeHtml(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    function updateChart(data) {
        const ctx = document.getElementById('sentimentChart').getContext('2d');
        
        if (sentimentChart) {
            sentimentChart.destroy();
        }

        const chartColors = {
            pos: 'rgba(52, 211, 153, 0.7)',
            neu: 'rgba(148, 163, 184, 0.7)',
            neg: 'rgba(248, 113, 113, 0.7)',
            compound: 'rgba(167, 139, 250, 0.7)'
        };
        sentimentChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Positive', 'Neutral', 'Negative', 'Compound'],
                datasets: [{
                    label: 'Sentiment Score',
                    data: [data.pos, data.neu, data.neg, data.compound],
                    backgroundColor: [chartColors.pos, chartColors.neu, chartColors.neg, chartColors.compound],
                    borderColor: ['#34d399', '#94a3b8', '#f87171', '#a78bfa'],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        grid: { color: 'rgba(255,255,255,0.06)' },
                        ticks: { color: '#a1a1aa', font: { size: 11 } }
                    },
                    y: {
                        min: -1,
                        max: 1,
                        beginAtZero: false,
                        grid: { color: 'rgba(255,255,255,0.06)' },
                        ticks: { color: '#a1a1aa', font: { size: 11 } }
                    }
                },
                plugins: {
                    legend: { display: false }
                }
            }
        });
    }
});
