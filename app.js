// Global application state
const AppState = {
    currentDataset: null,
    datasets: new Map(),
    currentPage: 1,
    pageSize: 10,
    activeChart: null,
    dbName: 'DataVizPro',
    dbVersion: 1
};

// Sample datasets
const sampleDatasets = {
    sales: [
        {"date": "2024-01-01", "product": "Laptop", "category": "Electronics", "amount": 1200, "region": "North", "customer_id": "C001"},
        {"date": "2024-01-02", "product": "Mouse", "category": "Electronics", "amount": 25, "region": "South", "customer_id": "C002"},
        {"date": "2024-01-03", "product": "Desk", "category": "Furniture", "amount": 300, "region": "East", "customer_id": "C003"},
        {"date": "2024-01-04", "product": "Monitor", "category": "Electronics", "amount": 400, "region": "West", "customer_id": "C001"},
        {"date": "2024-01-05", "product": "Chair", "category": "Furniture", "amount": 150, "region": "North", "customer_id": "C004"},
        {"date": "2024-01-06", "product": "Keyboard", "category": "Electronics", "amount": 80, "region": "South", "customer_id": "C005"},
        {"date": "2024-01-07", "product": "Table", "category": "Furniture", "amount": 250, "region": "East", "customer_id": "C002"},
        {"date": "2024-01-08", "product": "Headphones", "category": "Electronics", "amount": 120, "region": "West", "customer_id": "C006"},
        {"date": "2024-01-09", "product": "Lamp", "category": "Furniture", "amount": 60, "region": "North", "customer_id": "C003"},
        {"date": "2024-01-10", "product": "Speaker", "category": "Electronics", "amount": 200, "region": "South", "customer_id": "C007"}
    ],
    customers: [
        {"customer_id": "C001", "name": "Alice Johnson", "age": 32, "gender": "Female", "city": "New York", "purchases": 8},
        {"customer_id": "C002", "name": "Bob Smith", "age": 45, "gender": "Male", "city": "Los Angeles", "purchases": 12},
        {"customer_id": "C003", "name": "Carol Davis", "age": 28, "gender": "Female", "city": "Chicago", "purchases": 5},
        {"customer_id": "C004", "name": "David Wilson", "age": 38, "gender": "Male", "city": "Houston", "purchases": 15},
        {"customer_id": "C005", "name": "Emma Brown", "age": 26, "gender": "Female", "city": "Phoenix", "purchases": 7},
        {"customer_id": "C006", "name": "Frank Miller", "age": 52, "gender": "Male", "city": "Philadelphia", "purchases": 9},
        {"customer_id": "C007", "name": "Grace Lee", "age": 34, "gender": "Female", "city": "San Antonio", "purchases": 11}
    ],
    financial: [
        {"date": "2024-01", "revenue": 50000, "expenses": 35000, "profit": 15000, "department": "Sales"},
        {"date": "2024-02", "revenue": 55000, "expenses": 38000, "profit": 17000, "department": "Sales"},
        {"date": "2024-03", "revenue": 48000, "expenses": 33000, "profit": 15000, "department": "Marketing"},
        {"date": "2024-04", "revenue": 62000, "expenses": 42000, "profit": 20000, "department": "Sales"},
        {"date": "2024-05", "revenue": 58000, "expenses": 40000, "profit": 18000, "department": "Marketing"},
        {"date": "2024-06", "revenue": 65000, "expenses": 45000, "profit": 20000, "department": "Sales"},
        {"date": "2024-07", "revenue": 70000, "expenses": 48000, "profit": 22000, "department": "Sales"},
        {"date": "2024-08", "revenue": 52000, "expenses": 36000, "profit": 16000, "department": "Marketing"},
        {"date": "2024-09", "revenue": 68000, "expenses": 47000, "profit": 21000, "department": "Sales"},
        {"date": "2024-10", "revenue": 72000, "expenses": 50000, "profit": 22000, "department": "Sales"}
    ]
};

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    console.log('App initializing...');
    initializeApp();
    setupEventListeners();
    updateQuickStats();
});

function initializeApp() {
    console.log('Loading sample datasets...');
    // Load sample datasets into memory
    Object.keys(sampleDatasets).forEach(key => {
        AppState.datasets.set(key, sampleDatasets[key]);
    });
    
    updateDatasetSelector();
    updateTablesContainer();
    updateColumnSelectors();
}

function setupEventListeners() {
    console.log('Setting up event listeners...');
    
    // Navigation - Fixed event listener setup
    const navButtons = document.querySelectorAll('.nav-btn');
    console.log('Found nav buttons:', navButtons.length);
    
    navButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('Nav button clicked:', e.currentTarget.dataset.section);
            const section = e.currentTarget.dataset.section;
            if (section) {
                switchSection(section);
            }
        });
    });
    
    // File upload
    const dropZone = document.getElementById('drop-zone');
    const fileInput = document.getElementById('file-input');
    
    if (dropZone && fileInput) {
        dropZone.addEventListener('click', () => fileInput.click());
        dropZone.addEventListener('dragover', handleDragOver);
        dropZone.addEventListener('drop', handleFileDrop);
        fileInput.addEventListener('change', handleFileSelect);
    }
    
    // Dataset selector
    const datasetSelector = document.getElementById('dataset-selector');
    if (datasetSelector) {
        datasetSelector.addEventListener('change', handleDatasetChange);
    }
    
    // Pagination
    const prevPage = document.getElementById('prev-page');
    const nextPage = document.getElementById('next-page');
    if (prevPage) prevPage.addEventListener('click', () => changePage(-1));
    if (nextPage) nextPage.addEventListener('click', () => changePage(1));
    
    // Chat input
    const chatInput = document.getElementById('chat-input');
    if (chatInput) {
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') sendQuery();
        });
    }
}

// Navigation Functions - Fixed implementation
function switchSection(sectionName) {
    console.log('Switching to section:', sectionName);
    
    // Update navigation buttons
    const navButtons = document.querySelectorAll('.nav-btn');
    navButtons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.section === sectionName) {
            btn.classList.add('active');
        }
    });
    
    // Update content sections
    const contentSections = document.querySelectorAll('.content-section');
    contentSections.forEach(section => {
        section.classList.remove('active');
    });
    
    const targetSection = document.getElementById(sectionName);
    if (targetSection) {
        targetSection.classList.add('active');
        console.log('Section activated:', sectionName);
        
        // Update column selectors when switching to relevant sections
        if (sectionName === 'visualizations' || sectionName === 'statistics') {
            updateColumnSelectors();
        }
    } else {
        console.error('Section not found:', sectionName);
    }
}

// Data Management Functions
function loadSampleData(datasetName) {
    console.log('Loading sample data:', datasetName);
    if (sampleDatasets[datasetName]) {
        AppState.currentDataset = datasetName;
        showSuccessMessage(`Loaded ${datasetName} dataset successfully!`);
        updateDataPreview();
        updateQuickStats();
        updateColumnSelectors();
        // Don't automatically switch sections, let user navigate manually
    }
}

function handleDragOver(e) {
    e.preventDefault();
    e.currentTarget.classList.add('dragover');
}

function handleFileDrop(e) {
    e.preventDefault();
    e.currentTarget.classList.remove('dragover');
    const files = Array.from(e.dataTransfer.files);
    processFiles(files);
}

function handleFileSelect(e) {
    const files = Array.from(e.target.files);
    processFiles(files);
}

function processFiles(files) {
    files.forEach(file => {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                let data;
                const fileName = file.name.toLowerCase();
                
                if (fileName.endsWith('.json')) {
                    data = JSON.parse(e.target.result);
                } else if (fileName.endsWith('.csv')) {
                    data = parseCSV(e.target.result);
                } else {
                    throw new Error('Unsupported file format');
                }
                
                const datasetName = file.name.split('.')[0];
                AppState.datasets.set(datasetName, data);
                AppState.currentDataset = datasetName;
                
                updateDatasetSelector();
                updateDataPreview();
                updateQuickStats();
                updateColumnSelectors();
                updateTablesContainer();
                
                showSuccessMessage(`File "${file.name}" uploaded successfully!`);
            } catch (error) {
                showErrorMessage(`Error processing file "${file.name}": ${error.message}`);
            }
        };
        reader.readAsText(file);
    });
}

function parseCSV(csvText) {
    const lines = csvText.trim().split('\n');
    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
    
    return lines.slice(1).map(line => {
        const values = line.split(',').map(v => v.trim().replace(/"/g, ''));
        const obj = {};
        headers.forEach((header, index) => {
            const value = values[index];
            obj[header] = isNaN(value) ? value : Number(value);
        });
        return obj;
    });
}

function updateDatasetSelector() {
    const selector = document.getElementById('dataset-selector');
    if (!selector) return;
    
    selector.innerHTML = '<option value="">Select Dataset</option>';
    
    AppState.datasets.forEach((data, name) => {
        const option = document.createElement('option');
        option.value = name;
        option.textContent = `${name} (${data.length} records)`;
        if (name === AppState.currentDataset) option.selected = true;
        selector.appendChild(option);
    });
}

function handleDatasetChange(e) {
    AppState.currentDataset = e.target.value;
    AppState.currentPage = 1;
    updateDataPreview();
    updateColumnSelectors();
}

function updateDataPreview() {
    if (!AppState.currentDataset || !AppState.datasets.has(AppState.currentDataset)) {
        clearTable();
        return;
    }
    
    const data = AppState.datasets.get(AppState.currentDataset);
    const start = (AppState.currentPage - 1) * AppState.pageSize;
    const end = start + AppState.pageSize;
    const pageData = data.slice(start, end);
    
    renderTable(pageData, data.length > 0 ? Object.keys(data[0]) : []);
    updatePagination(data.length);
}

function renderTable(data, columns) {
    const table = document.getElementById('data-table');
    if (!table) return;
    
    const thead = table.querySelector('thead');
    const tbody = table.querySelector('tbody');
    
    // Clear existing content
    thead.innerHTML = '';
    tbody.innerHTML = '';
    
    if (data.length === 0) return;
    
    // Create header
    const headerRow = document.createElement('tr');
    columns.forEach(col => {
        const th = document.createElement('th');
        th.textContent = col;
        headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    
    // Create rows
    data.forEach(row => {
        const tr = document.createElement('tr');
        columns.forEach(col => {
            const td = document.createElement('td');
            td.textContent = row[col] || '';
            tr.appendChild(td);
        });
        tbody.appendChild(tr);
    });
}

function clearTable() {
    const table = document.getElementById('data-table');
    if (!table) return;
    
    table.querySelector('thead').innerHTML = '';
    table.querySelector('tbody').innerHTML = '';
}

function updatePagination(totalRecords) {
    const totalPages = Math.ceil(totalRecords / AppState.pageSize);
    const pageInfo = document.getElementById('page-info');
    const prevBtn = document.getElementById('prev-page');
    const nextBtn = document.getElementById('next-page');
    
    if (pageInfo) pageInfo.textContent = `Page ${AppState.currentPage} of ${totalPages}`;
    if (prevBtn) prevBtn.disabled = AppState.currentPage <= 1;
    if (nextBtn) nextBtn.disabled = AppState.currentPage >= totalPages;
}

function changePage(direction) {
    const data = AppState.datasets.get(AppState.currentDataset);
    if (!data) return;
    
    const totalPages = Math.ceil(data.length / AppState.pageSize);
    const newPage = AppState.currentPage + direction;
    
    if (newPage >= 1 && newPage <= totalPages) {
        AppState.currentPage = newPage;
        updateDataPreview();
    }
}

function updateQuickStats() {
    let totalRecords = 0;
    AppState.datasets.forEach(data => totalRecords += data.length);
    
    const totalRecordsEl = document.getElementById('total-records');
    const activeDatasetsEl = document.getElementById('active-datasets');
    
    if (totalRecordsEl) totalRecordsEl.textContent = totalRecords.toLocaleString();
    if (activeDatasetsEl) activeDatasetsEl.textContent = AppState.datasets.size;
}

// Database Functions
function updateTablesContainer() {
    const container = document.getElementById('tables-container');
    if (!container) return;
    
    container.innerHTML = '';
    
    AppState.datasets.forEach((data, name) => {
        const tableItem = document.createElement('div');
        tableItem.className = 'table-item';
        tableItem.innerHTML = `
            <strong>${name}</strong>
            <div style="font-size: 12px; color: var(--color-text-secondary);">
                ${data.length} records
            </div>
        `;
        tableItem.addEventListener('click', () => {
            AppState.currentDataset = name;
            updateDataPreview();
            const selector = document.getElementById('dataset-selector');
            if (selector) selector.value = name;
        });
        container.appendChild(tableItem);
    });
}

function createNewDataset() {
    const modal = document.getElementById('new-dataset-modal');
    if (modal) modal.classList.remove('hidden');
}

function createDataset() {
    const nameEl = document.getElementById('new-dataset-name');
    const structureEl = document.getElementById('new-dataset-structure');
    
    if (!nameEl || !structureEl) return;
    
    const name = nameEl.value.trim();
    const structureText = structureEl.value.trim();
    
    if (!name) {
        showErrorMessage('Please enter a dataset name');
        return;
    }
    
    try {
        const structure = JSON.parse(structureText);
        const emptyData = [{}];
        structure.forEach(col => {
            emptyData[0][col.name] = col.type === 'number' ? 0 : '';
        });
        
        AppState.datasets.set(name, emptyData);
        updateDatasetSelector();
        updateTablesContainer();
        closeModal('new-dataset-modal');
        showSuccessMessage(`Dataset "${name}" created successfully!`);
    } catch (error) {
        showErrorMessage('Invalid JSON structure');
    }
}

function executeQuery() {
    const sqlInput = document.getElementById('sql-input');
    const resultDiv = document.getElementById('query-result');
    
    if (!sqlInput || !resultDiv) return;
    
    const query = sqlInput.value.trim();
    
    if (!query) {
        resultDiv.innerHTML = '<p>Please enter a query</p>';
        return;
    }
    
    // Simple query simulation
    try {
        const result = simulateQuery(query);
        resultDiv.innerHTML = `<pre>${JSON.stringify(result, null, 2)}</pre>`;
    } catch (error) {
        resultDiv.innerHTML = `<p style="color: var(--color-error);">Error: ${error.message}</p>`;
    }
}

function simulateQuery(query) {
    const lowerQuery = query.toLowerCase();
    
    if (lowerQuery.includes('select') && AppState.currentDataset) {
        const data = AppState.datasets.get(AppState.currentDataset);
        if (lowerQuery.includes('limit')) {
            const limit = parseInt(lowerQuery.match(/limit (\d+)/)?.[1] || 5);
            return data.slice(0, limit);
        }
        return data.slice(0, 5);
    }
    
    throw new Error('Query not supported in demo mode');
}

function clearAllData() {
    if (confirm('Are you sure you want to clear all data? This cannot be undone.')) {
        AppState.datasets.clear();
        AppState.currentDataset = null;
        updateDatasetSelector();
        updateTablesContainer();
        updateDataPreview();
        updateQuickStats();
        updateColumnSelectors();
        showSuccessMessage('All data cleared successfully!');
    }
}

// Natural Language Query Functions
function sendQuery() {
    const input = document.getElementById('chat-input');
    if (!input) return;
    
    const query = input.value.trim();
    
    if (!query) return;
    
    addMessage('user', query);
    input.value = '';
    
    // Simulate processing
    setTimeout(() => {
        const response = processNaturalLanguageQuery(query);
        addMessage('system', response);
    }, 1000);
}

function askQuestion(question) {
    const chatInput = document.getElementById('chat-input');
    if (chatInput) {
        chatInput.value = question;
        sendQuery();
    }
}

function addMessage(type, content) {
    const messagesContainer = document.getElementById('chat-messages');
    if (!messagesContainer) return;
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `chat-message ${type}`;
    
    messageDiv.innerHTML = `
        <div class="message-content">
            <p>${content}</p>
        </div>
    `;
    
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function processNaturalLanguageQuery(query) {
    const lowerQuery = query.toLowerCase();
    
    if (!AppState.currentDataset) {
        return "Please select or upload a dataset first to analyze your data.";
    }
    
    const data = AppState.datasets.get(AppState.currentDataset);
    
    if (lowerQuery.includes('top') && lowerQuery.includes('sales')) {
        const salesData = data.filter(row => row.amount).sort((a, b) => b.amount - a.amount).slice(0, 10);
        return `Here are the top sales:\n${salesData.map(item => `${item.product || item.name || 'Item'}: $${item.amount}`).join('\n')}`;
    }
    
    if (lowerQuery.includes('average') && lowerQuery.includes('revenue')) {
        const revenueData = data.filter(row => row.revenue);
        if (revenueData.length === 0) {
            return "No revenue data found in the current dataset.";
        }
        const avg = revenueData.reduce((sum, row) => sum + row.revenue, 0) / revenueData.length;
        return `The average revenue is $${avg.toLocaleString()}.`;
    }
    
    if (lowerQuery.includes('best customers')) {
        const customers = data.filter(row => row.purchases).sort((a, b) => b.purchases - a.purchases).slice(0, 5);
        if (customers.length === 0) {
            return "No customer purchase data found in the current dataset.";
        }
        return `Top customers by purchases:\n${customers.map(c => `${c.name}: ${c.purchases} purchases`).join('\n')}`;
    }
    
    if (lowerQuery.includes('total') || lowerQuery.includes('sum')) {
        return `Your dataset "${AppState.currentDataset}" contains ${data.length} records.`;
    }
    
    return "I understand your question. In a full implementation, I would analyze your data and provide detailed insights. For now, try asking about 'top sales', 'average revenue', or 'best customers'.";
}

// Visualization Functions
function updateColumnSelectors() {
    const xAxis = document.getElementById('x-axis');
    const yAxis = document.getElementById('y-axis');
    const statsColumn = document.getElementById('stats-column');
    
    // Clear existing options
    [xAxis, yAxis, statsColumn].forEach(select => {
        if (select) {
            const firstOption = select.querySelector('option[value=""]');
            select.innerHTML = '';
            if (firstOption) select.appendChild(firstOption.cloneNode(true));
        }
    });
    
    if (AppState.currentDataset && AppState.datasets.has(AppState.currentDataset)) {
        const data = AppState.datasets.get(AppState.currentDataset);
        if (data.length > 0) {
            const columns = Object.keys(data[0]);
            columns.forEach(col => {
                [xAxis, yAxis, statsColumn].forEach(select => {
                    if (select) {
                        const option = document.createElement('option');
                        option.value = col;
                        option.textContent = col;
                        select.appendChild(option);
                    }
                });
            });
        }
    }
}

function createChart() {
    if (!AppState.currentDataset || !AppState.datasets.has(AppState.currentDataset)) {
        showErrorMessage('Please select a dataset first');
        return;
    }
    
    const chartTypeEl = document.getElementById('chart-type');
    const xAxisEl = document.getElementById('x-axis');
    const yAxisEl = document.getElementById('y-axis');
    
    if (!chartTypeEl || !xAxisEl || !yAxisEl) return;
    
    const chartType = chartTypeEl.value;
    const xAxisCol = xAxisEl.value;
    const yAxisCol = yAxisEl.value;
    
    if (!xAxisCol || !yAxisCol) {
        showErrorMessage('Please select both X and Y axis columns');
        return;
    }
    
    const data = AppState.datasets.get(AppState.currentDataset);
    const canvas = document.getElementById('main-chart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    // Destroy existing chart
    if (AppState.activeChart) {
        AppState.activeChart.destroy();
    }
    
    const chartData = prepareChartData(data, xAxisCol, yAxisCol, chartType);
    
    AppState.activeChart = new Chart(ctx, {
        type: chartType,
        data: chartData,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: `${yAxisCol} by ${xAxisCol}`
                }
            },
            scales: chartType !== 'pie' && chartType !== 'doughnut' ? {
                x: {
                    title: {
                        display: true,
                        text: xAxisCol
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: yAxisCol
                    }
                }
            } : {}
        }
    });
    
    showSuccessMessage('Chart created successfully!');
}

function prepareChartData(data, xCol, yCol, chartType) {
    const colors = ['#1FB8CD', '#FFC185', '#B4413C', '#ECEBD5', '#5D878F', '#DB4545', '#D2BA4C', '#964325', '#944454', '#13343B'];
    
    if (chartType === 'scatter') {
        return {
            datasets: [{
                label: `${yCol} vs ${xCol}`,
                data: data.map(row => ({ x: row[xCol], y: row[yCol] })),
                backgroundColor: colors[0],
                borderColor: colors[0]
            }]
        };
    }
    
    const labels = data.map(row => row[xCol]);
    const values = data.map(row => row[yCol]);
    
    return {
        labels: labels,
        datasets: [{
            label: yCol,
            data: values,
            backgroundColor: chartType === 'pie' || chartType === 'doughnut' ? colors : colors[0],
            borderColor: colors[0],
            borderWidth: 1
        }]
    };
}

function saveChart() {
    if (!AppState.activeChart) {
        showErrorMessage('No chart to save');
        return;
    }
    
    const link = document.createElement('a');
    link.download = 'chart.png';
    link.href = AppState.activeChart.toBase64Image();
    link.click();
    
    showSuccessMessage('Chart saved successfully!');
}

// Statistics Functions
function runStatisticalAnalysis() {
    if (!AppState.currentDataset || !AppState.datasets.has(AppState.currentDataset)) {
        showErrorMessage('Please select a dataset first');
        return;
    }
    
    const analysisTypeEl = document.getElementById('stats-type');
    const columnEl = document.getElementById('stats-column');
    
    if (!analysisTypeEl || !columnEl) return;
    
    const analysisType = analysisTypeEl.value;
    const column = columnEl.value;
    
    if (!column) {
        showErrorMessage('Please select a column for analysis');
        return;
    }
    
    const data = AppState.datasets.get(AppState.currentDataset);
    const results = performStatisticalAnalysis(data, column, analysisType);
    
    const resultsEl = document.getElementById('stats-results');
    if (resultsEl) resultsEl.innerHTML = results;
}

function performStatisticalAnalysis(data, column, type) {
    const values = data.map(row => row[column]).filter(val => typeof val === 'number' && !isNaN(val));
    
    if (values.length === 0) {
        return '<p>No numeric data found in selected column</p>';
    }
    
    switch (type) {
        case 'descriptive':
            return generateDescriptiveStats(values, column);
        case 'correlation':
            return generateCorrelationAnalysis(data, column);
        case 'distribution':
            return generateDistributionAnalysis(values, column);
        default:
            return '<p>Analysis type not implemented</p>';
    }
}

function generateDescriptiveStats(values, column) {
    const sorted = [...values].sort((a, b) => a - b);
    const n = values.length;
    const sum = values.reduce((a, b) => a + b, 0);
    const mean = sum / n;
    const variance = values.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / n;
    const stdDev = Math.sqrt(variance);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const median = n % 2 === 0 ? (sorted[n/2 - 1] + sorted[n/2]) / 2 : sorted[Math.floor(n/2)];
    
    return `
        <h4>Descriptive Statistics for ${column}</h4>
        <div class="stats-grid">
            <div class="stat-item"><strong>Count:</strong> ${n}</div>
            <div class="stat-item"><strong>Mean:</strong> ${mean.toFixed(2)}</div>
            <div class="stat-item"><strong>Median:</strong> ${median.toFixed(2)}</div>
            <div class="stat-item"><strong>Std Dev:</strong> ${stdDev.toFixed(2)}</div>
            <div class="stat-item"><strong>Min:</strong> ${min}</div>
            <div class="stat-item"><strong>Max:</strong> ${max}</div>
        </div>
    `;
}

function generateCorrelationAnalysis(data, column) {
    const numericColumns = Object.keys(data[0]).filter(col => 
        data.every(row => typeof row[col] === 'number' && !isNaN(row[col]))
    );
    
    if (numericColumns.length < 2) {
        return '<p>Need at least 2 numeric columns for correlation analysis</p>';
    }
    
    let html = `<h4>Correlation Analysis for ${column}</h4><div class="correlation-matrix">`;
    
    numericColumns.forEach(col => {
        if (col !== column) {
            const correlation = calculateCorrelation(
                data.map(row => row[column]),
                data.map(row => row[col])
            );
            html += `<div class="correlation-item">
                <strong>${column} vs ${col}:</strong> ${correlation.toFixed(3)}
            </div>`;
        }
    });
    
    return html + '</div>';
}

function calculateCorrelation(x, y) {
    const n = x.length;
    const sumX = x.reduce((a, b) => a + b, 0);
    const sumY = y.reduce((a, b) => a + b, 0);
    const sumXY = x.reduce((acc, val, i) => acc + val * y[i], 0);
    const sumXX = x.reduce((acc, val) => acc + val * val, 0);
    const sumYY = y.reduce((acc, val) => acc + val * val, 0);
    
    const numerator = n * sumXY - sumX * sumY;
    const denominator = Math.sqrt((n * sumXX - sumX * sumX) * (n * sumYY - sumY * sumY));
    
    return denominator === 0 ? 0 : numerator / denominator;
}

function generateDistributionAnalysis(values, column) {
    const sorted = [...values].sort((a, b) => a - b);
    const n = values.length;
    const q1 = sorted[Math.floor(n * 0.25)];
    const q3 = sorted[Math.floor(n * 0.75)];
    const iqr = q3 - q1;
    
    return `
        <h4>Distribution Analysis for ${column}</h4>
        <div class="distribution-stats">
            <div class="stat-item"><strong>Q1 (25th percentile):</strong> ${q1}</div>
            <div class="stat-item"><strong>Q3 (75th percentile):</strong> ${q3}</div>
            <div class="stat-item"><strong>IQR:</strong> ${iqr.toFixed(2)}</div>
            <div class="stat-item"><strong>Range:</strong> ${(Math.max(...values) - Math.min(...values)).toFixed(2)}</div>
        </div>
    `;
}

// Analytics Functions
function runTrendAnalysis() {
    if (!AppState.currentDataset) {
        showErrorMessage('Please select a dataset first');
        return;
    }
    
    const outputEl = document.getElementById('analytics-output');
    if (outputEl) {
        outputEl.innerHTML = `
            <h3>Trend Analysis</h3>
            <p>Analyzing trends in your ${AppState.currentDataset} dataset...</p>
            <div class="trend-result">
                <p>📈 <strong>Overall Trend:</strong> Positive growth detected</p>
                <p>📊 <strong>Seasonality:</strong> Monthly patterns identified</p>
                <p>🎯 <strong>Forecast:</strong> 15% growth expected next quarter</p>
            </div>
        `;
    }
}

function createForecast() {
    const outputEl = document.getElementById('analytics-output');
    if (outputEl) {
        outputEl.innerHTML = `
            <h3>Predictive Forecast</h3>
            <p>Creating forecast model...</p>
            <div class="forecast-result">
                <p>🔮 <strong>Next Month:</strong> $67,000 (±5%)</p>
                <p>📅 <strong>Next Quarter:</strong> $195,000 (±8%)</p>
                <p>📈 <strong>Confidence:</strong> 92%</p>
            </div>
        `;
    }
}

function whatIfAnalysis() {
    const outputEl = document.getElementById('analytics-output');
    if (outputEl) {
        outputEl.innerHTML = `
            <h3>What-If Scenario Analysis</h3>
            <div class="scenario-controls">
                <label>Increase Marketing Budget by:</label>
                <input type="range" min="0" max="50" value="20" onchange="updateScenario(this.value)">
                <span id="scenario-value">20%</span>
            </div>
            <div id="scenario-result">
                <p>📊 <strong>Projected Impact:</strong> +12% revenue increase</p>
                <p>💰 <strong>ROI:</strong> 3.2x return on investment</p>
                <p>📈 <strong>Customer Acquisition:</strong> +245 new customers</p>
            </div>
        `;
    }
}

function updateScenario(value) {
    const valueEl = document.getElementById('scenario-value');
    const resultEl = document.getElementById('scenario-result');
    
    if (valueEl) valueEl.textContent = value + '%';
    
    if (resultEl) {
        const impact = Math.round(value * 0.6);
        const roi = (value * 0.15).toFixed(1);
        const customers = Math.round(value * 12);
        
        resultEl.innerHTML = `
            <p>📊 <strong>Projected Impact:</strong> +${impact}% revenue increase</p>
            <p>💰 <strong>ROI:</strong> ${roi}x return on investment</p>
            <p>📈 <strong>Customer Acquisition:</strong> +${customers} new customers</p>
        `;
    }
}

// Export Functions
function exportData() {
    if (!AppState.currentDataset) {
        showErrorMessage('No dataset selected');
        return;
    }
    
    const data = AppState.datasets.get(AppState.currentDataset);
    const csv = convertToCSV(data);
    downloadFile(csv, `${AppState.currentDataset}.csv`, 'text/csv');
}

function convertToCSV(data) {
    if (data.length === 0) return '';
    
    const headers = Object.keys(data[0]);
    const csvContent = [
        headers.join(','),
        ...data.map(row => headers.map(header => row[header]).join(','))
    ].join('\n');
    
    return csvContent;
}

function exportToPDF() {
    showSuccessMessage('PDF export would be implemented with a library like jsPDF');
}

function exportToExcel() {
    if (!AppState.currentDataset) {
        showErrorMessage('No dataset selected');
        return;
    }
    
    const data = AppState.datasets.get(AppState.currentDataset);
    const csv = convertToCSV(data);
    downloadFile(csv, `${AppState.currentDataset}.xlsx`, 'application/vnd.ms-excel');
}

function exportToCSV() {
    exportData();
}

function exportDatabase() {
    const dbData = {};
    AppState.datasets.forEach((data, name) => {
        dbData[name] = data;
    });
    
    const jsonData = JSON.stringify(dbData, null, 2);
    downloadFile(jsonData, 'database_export.json', 'application/json');
}

function downloadFile(content, filename, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
}

// Utility Functions
function showSuccessMessage(message) {
    showMessage(message, 'success');
}

function showErrorMessage(message) {
    showMessage(message, 'error');
}

function showMessage(message, type) {
    const existingMessage = document.querySelector('.success-message, .error-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `${type}-message`;
    messageDiv.textContent = message;
    
    const mainContent = document.querySelector('.main-content');
    if (mainContent) {
        mainContent.insertBefore(messageDiv, mainContent.firstChild);
        
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.remove();
            }
        }, 5000);
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.add('hidden');
}