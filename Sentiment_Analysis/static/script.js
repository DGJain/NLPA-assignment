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

    function displayResults(data) {
        resultSection.classList.remove('hidden');

        // Update Label
        const labelEl = document.getElementById('sentimentLabel');
        labelEl.textContent = data.label;
        labelEl.className = `sentiment-badge ${data.label}`;

        // Update Scores and Bars
        updateBar('Pos', data.pos);
        updateBar('Neu', data.neu);
        updateBar('Neg', data.neg);
        updateBar('Compound', data.compound, true);

        // Preprocessed Text
        document.getElementById('preprocessedText').textContent = data.preprocessed_text;
    }

    function updateBar(type, value, isCompound = false) {
        const bar = document.getElementById(`bar${type}`);
        const val = document.getElementById(`val${type}`);
        
        let percentage;
        if (isCompound) {
            // Compound is -1 to 1. Map to 0-100% for display roughly, 
            // or just absolute value? 
            // Let's normalize (-1 to 1) -> (0 to 100) for width? 
            // Better: just show it as full width if it's 1. 
            // Design choice: maybe just width = abs(value) * 100?
            percentage = Math.abs(value) * 100;
        } else {
            percentage = value * 100;
        }
        
        bar.style.width = `${percentage}%`;
        val.textContent = value.toFixed(3);
    }
});
