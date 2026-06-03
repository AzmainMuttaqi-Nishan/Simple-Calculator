let display = document.getElementById('display');
let expression = '';

function appendNumber(number) {
    // Prevent multiple decimal points
    if (number === '.' && expression.includes('.')) {
        return;
    }
    expression += number;
    updateDisplay();
}

function appendOperator(operator) {
    // Prevent operator at the beginning
    if (expression === '') {
        return;
    }
    // Prevent multiple operators in a row
    if (['+', '-', '*', '/', '%'].includes(expression.slice(-1))) {
        return;
    }
    expression += operator;
    updateDisplay();
}

function clearDisplay() {
    expression = '';
    updateDisplay();
}

function toggleSign() {
    if (expression !== '') {
        // Extract the last number
        let lastNumberMatch = expression.match(/[-+]?\d*\.?\d+$/);
        if (lastNumberMatch) {
            let lastNumber = lastNumberMatch[0];
            let toggledNumber = lastNumber.startsWith('-') ? lastNumber.slice(1) : '-' + lastNumber;
            expression = expression.slice(0, -lastNumber.length) + toggledNumber;
            updateDisplay();
        }
    }
}

function calculate() {
    if (expression === '') {
        return;
    }
    
    try {
        // Use Function instead of eval for better security
        let result = Function('"use strict"; return (' + expression + ')')();
        
        // Round to avoid floating point errors
        result = Math.round(result * 100000000) / 100000000;
        
        expression = result.toString();
        updateDisplay();
    } catch (error) {
        display.value = 'Error';
        expression = '';
    }
}

function updateDisplay() {
    display.value = expression || '0';
}

// Initialize display
updateDisplay();

// Add keyboard support
document.addEventListener('keydown', (event) => {
    const key = event.key;
    
    if (key >= '0' && key <= '9') {
        appendNumber(key);
    } else if (key === '.') {
        appendNumber('.');
    } else if (key === '+' || key === '-' || key === '*' || key === '/') {
        appendOperator(key);
    } else if (key === 'Enter' || key === '=') {
        event.preventDefault();
        calculate();
    } else if (key === 'Backspace') {
        event.preventDefault();
        expression = expression.slice(0, -1);
        updateDisplay();
    } else if (key === 'Escape') {
        clearDisplay();
    }
});