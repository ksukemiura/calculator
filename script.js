document.addEventListener('DOMContentLoaded', () => {
    const previousOperandElement = document.querySelector('.previous-operand');
    const currentOperandElement = document.querySelector('.current-operand');
    const numberButtons = document.querySelectorAll('.number');
    const operatorButtons = document.querySelectorAll('.operator');
    
    let currentOperand = '0';
    let previousOperand = '';
    let operation = undefined;
    let shouldResetScreen = false;
    
    // Number button click handlers
    numberButtons.forEach(button => {
        button.addEventListener('click', () => {
            appendNumber(button.textContent);
            updateDisplay();
        });
    });
    
    // Operator button click handlers
    operatorButtons.forEach(button => {
        button.addEventListener('click', () => {
            const action = button.dataset.action;
            
            if (action === 'clear') {
                clear();
            } else if (action === 'delete') {
                deleteNumber();
            } else if (action === 'equals') {
                calculate();
            } else if (action === 'percent') {
                percent();
            } else {
                // Handle operations (+, -, ×, ÷)
                chooseOperation(action);
            }
            
            updateDisplay();
        });
    });
    
    // Handle keyboard input
    document.addEventListener('keydown', handleKeyboardInput);
    
    function handleKeyboardInput(e) {
        if (e.key >= '0' && e.key <= '9') appendNumber(e.key);
        if (e.key === '.') appendNumber(e.key);
        if (e.key === '=' || e.key === 'Enter') {
            e.preventDefault();
            calculate();
        }
        if (e.key === 'Backspace') deleteNumber();
        if (e.key === 'Escape') clear();
        if (e.key === '+') chooseOperation('add');
        if (e.key === '-') chooseOperation('subtract');
        if (e.key === '*') chooseOperation('multiply');
        if (e.key === '/') {
            e.preventDefault();
            chooseOperation('divide');
        }
        if (e.key === '%') percent();
        
        updateDisplay();
    }
    
    function appendNumber(number) {
        if (shouldResetScreen) {
            currentOperand = '';
            shouldResetScreen = false;
        }
        
        // Prevent multiple decimals
        if (number === '.' && currentOperand.includes('.')) return;
        
        // Replace 0 with number unless it's a decimal
        if (currentOperand === '0' && number !== '.') {
            currentOperand = number;
        } else {
            currentOperand += number;
        }
    }
    
    function chooseOperation(selectedOperation) {
        if (currentOperand === '') return;
        
        if (previousOperand !== '') {
            calculate();
        }
        
        operation = selectedOperation;
        previousOperand = currentOperand;
        currentOperand = '';
    }
    
    function calculate() {
        let computation;
        const prev = parseFloat(previousOperand);
        const current = parseFloat(currentOperand);
        
        if (isNaN(prev) || isNaN(current)) return;
        
        switch (operation) {
            case 'add':
                computation = prev + current;
                break;
            case 'subtract':
                computation = prev - current;
                break;
            case 'multiply':
                computation = prev * current;
                break;
            case 'divide':
                if (current === 0) {
                    alert("Cannot divide by zero");
                    clear();
                    return;
                }
                computation = prev / current;
                break;
            default:
                return;
        }
        
        // Format the result
        currentOperand = computation.toString();
        operation = undefined;
        previousOperand = '';
        shouldResetScreen = true;
    }
    
    function percent() {
        if (currentOperand === '') return;
        currentOperand = (parseFloat(currentOperand) / 100).toString();
    }
    
    function deleteNumber() {
        if (currentOperand === '0') return;
        if (currentOperand.length === 1) {
            currentOperand = '0';
        } else {
            currentOperand = currentOperand.slice(0, -1);
        }
    }
    
    function clear() {
        currentOperand = '0';
        previousOperand = '';
        operation = undefined;
    }
    
    function updateDisplay() {
        currentOperandElement.textContent = formatDisplayNumber(currentOperand);
        
        if (operation != null) {
            let operationSymbol;
            switch (operation) {
                case 'add': operationSymbol = '+'; break;
                case 'subtract': operationSymbol = '-'; break;
                case 'multiply': operationSymbol = '×'; break;
                case 'divide': operationSymbol = '÷'; break;
                default: operationSymbol = '';
            }
            previousOperandElement.textContent = `${formatDisplayNumber(previousOperand)} ${operationSymbol}`;
        } else {
            previousOperandElement.textContent = '';
        }
    }
    
    function formatDisplayNumber(number) {
        const stringNumber = number.toString();
        const integerDigits = parseFloat(stringNumber.split('.')[0]);
        const decimalDigits = stringNumber.split('.')[1];
        
        let integerDisplay;
        
        if (isNaN(integerDigits)) {
            integerDisplay = '';
        } else {
            integerDisplay = integerDigits.toLocaleString('en', {
                maximumFractionDigits: 0
            });
        }
        
        if (decimalDigits != null) {
            return `${integerDisplay}.${decimalDigits}`;
        } else {
            return integerDisplay;
        }
    }
});