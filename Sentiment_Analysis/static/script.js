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

        // Update Label
        const labelEl = document.getElementById('sentimentLabel');
        labelEl.textContent = data.label;
        labelEl.className = `sentiment-badge ${data.label}`;

        // Render Chart
        updateChart(data);

        // Render Highlights
        const highlightBox = document.getElementById('highlightedText');
        highlightBox.innerHTML = data.highlighted_tokens.map(token => {
            const className = token.category !== 'neutral' ? `highlight-token highlight-${token.category}` : '';
            return `<span class="${className}" title="Score: ${token.score}">${token.word}</span>`;
        }).join(' ');

        // Render Word Stats
        const statsList = document.getElementById('wordStatsList');
        statsList.innerHTML = data.word_stats.map(([word, count]) => {
            return `<li>
                <span class="word">${word}</span>
                <span class="word-count">${count}</span>
            </li>`;
        }).join('');

        // Preprocessed Text
        document.getElementById('preprocessedText').textContent = data.preprocessed_text;
    }

    function updateChart(data) {
        const ctx = document.getElementById('sentimentChart').getContext('2d');
        
        if (sentimentChart) {
            sentimentChart.destroy();
        }

        sentimentChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Positive', 'Neutral', 'Negative', 'Compound'],
                datasets: [{
                    label: 'Sentiment Score',
                    data: [data.pos, data.neu, data.neg, data.compound],
                    backgroundColor: [
                        'rgba(40, 167, 69, 0.6)',  // Pos
                        'rgba(108, 117, 125, 0.6)', // Neu
                        'rgba(220, 53, 69, 0.6)',   // Neg
                        'rgba(0, 210, 255, 0.6)'    // Compound
                    ],
                    borderColor: [
                        'rgba(40, 167, 69, 1)',
                        'rgba(108, 117, 125, 1)',
                        'rgba(220, 53, 69, 1)',
                        'rgba(0, 210, 255, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 1
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });
    }
});
