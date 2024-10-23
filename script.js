let expressionElement = document.getElementById("expression");
let expression = expressionElement.value;
let resultElement = document.getElementById("result");
let resultDisplay = resultElement.innerHTML;
let allowAppending = true;
let equalPressed = false;
const operatorRegex = /[÷×+-.\*\/%]/;
const digitRegex = /\d/;
const inversionRegex = /[÷×+\-\/\*%](?=\d(?!.*[÷×+\-\/\*%]\d))/; // Matches the last operator followed by a digit in the string

let backspace = (str) => str.slice(0, -1);
let replaceLastChar = (str, char) => expression = backspace(str).concat(char);
let replaceCharAtIndex = (str, i, char) => str.substring(0, i) + char + str.substring(i + 1);
let appendChar = (str, char) => expression = str.concat(char);
let appendCharAtIndex = (str, i, char) => str.substring(0, (i + 1)) + char + str.substring(i + 1);
let isDigit = (char) => digitRegex.test(char);
let isOperator = (char) => operatorRegex.test(char);
let updateExpression = () => expression = expressionElement.value;

document.addEventListener('keydown', function(event) {
    if (event.key === 'Delete') {
        clearDisplay();
        updateDisplay();
    }
}); 

document.addEventListener('keydown', function(event) {
    if (event.key === 'F9') {
        invertSign();
        updateDisplay();
    }
}); 

function invertSign() {
    let lastNonDigitIndex = expression.search(inversionRegex);
    let lastNonDigit = expression[lastNonDigitIndex];
    console.log(lastNonDigit);
    console.log(lastNonDigitIndex);

    if (lastNonDigit == '-') { // Handles the case where the positive sign '+' should be omitted
        expression = isOperator(expression[lastNonDigitIndex - 1]) || expression[lastNonDigitIndex - 1] === undefined ? replaceCharAtIndex(expression, lastNonDigitIndex, '') : replaceCharAtIndex(expression, lastNonDigitIndex, '+');
    }
    else if (lastNonDigit == '+') {
        expression = replaceCharAtIndex(expression, lastNonDigitIndex, '-');
    }
    else {
        expression = appendCharAtIndex(expression, lastNonDigitIndex, '-');
    }
}

function clearDisplay() {
    expression = '';
    resultDisplay = '|';
    allowAppending = true;
    equalPressed = false;
}

function updateDisplay() {
    expressionElement.value = expression;
    expressionElement.focus();
    resultElement.innerHTML = resultDisplay;
}

function solve(expressionStr) {
    expressionStr = expressionStr.replaceAll('÷', '/');
    expressionStr = expressionStr.replaceAll('×', '*');
    
    if (expressionStr.includes('%')) {
        let matches = [...expressionStr.matchAll(/%/g)];
        let indexes = matches.map(match => match.index);

        indexes.forEach(i => {
            if (isDigit(expressionStr[i + 1])){
                expressionStr = appendCharAtIndex(expressionStr, i, '*');
            }
        });
    }
    expressionStr = expressionStr.replaceAll('%', '/100');

    try {
        expression = math.evaluate(expressionStr).toString();
        resultDisplay = `${expression}|`;
        allowAppending = false;
        equalPressed = true;
    }
    catch (error) {
        if (error.name == 'SyntaxError'){
            resultDisplay = 'Malformed expression|';
        }
        else {
            console.log(`Name: ${error.name} Message: ${error.message}`);
            resultDisplay = 'Error';
        }
    }
}

function handleSubmition(event) {
    event.preventDefault();
    solve(expression);
    updateDisplay();
}

function inputClick(button) {       // handles button presses
    let pressedButton = button.innerHTML;
    let lastCharacterTyped = expression[expression.length - 1];
    
    if (pressedButton == 'C') {     // Clear Button
        clearDisplay();
    }
    else if (pressedButton == '⇦') {        // Backspace
        expression = expression.length > 1 ? backspace(expression) : '';
        if (equalPressed) {
            equalPressed = false;
            allowAppending = true;
        }
    }
    else if (pressedButton == '+/-') {
        if (expression != '') {
            invertSign();
        }
    }
    else if (pressedButton == '=') {
       solve(expression);
    }
    else if (isDigit(pressedButton)) {
        if (equalPressed) {
            expression = pressedButton;
            allowAppending = true;
            equalPressed = false;
        }
        else {
            if (allowAppending == true) {
                appendChar(expression, pressedButton);
            }
            else {
                expression = pressedButton;
                allowAppending = true;
            }
        }
    }
    else if (pressedButton == '.') {
        expression = isDigit(lastCharacterTyped) ? appendChar(expression, pressedButton) : replaceLastChar(expression, pressedButton);
    }
    // else if (pressedButton == '%') {
        
    // }
    else {  // handles the operators
        if (equalPressed) {
            equalPressed = false;
            allowAppending = true;
        }

        if (expression == '') {
            expression = '0';
        }

        if (pressedButton == '-' && lastCharacterTyped != '-' && lastCharacterTyped != '.') {
            appendChar(expression,pressedButton);
        }
        else if (isOperator(lastCharacterTyped)) {
            replaceLastChar(expression, pressedButton);
        }
        else {
            appendChar(expression, pressedButton);
        }
    }
    updateDisplay();
}
