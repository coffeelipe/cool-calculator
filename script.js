let expressionElement = document.getElementById("expression");
let expression = expressionElement.innerHTML;
let resultElement = document.getElementById("result");
let resultDisplay = resultElement.innerHTML;
let allowAppending = false;
let equalPressed = false;
const operatorRegex = /[÷×+-.]/;
const digitRegex = /\d/;
const inversionRegex = /\D(?=\d(?!.*\D\d))/;

let backspace = (str) => str.slice(0, -1);
let replaceLastChar = (str, char) => expression = backspace(str).concat(char);
let replaceCharAtIndex = (str, i, char) => str.substring(0, i) + char + str.substring(i + 1);
let appendChar = (str, char) => expression = str.concat(char);
let appendCharAtIndex = (str, i, char) => str.substring(0, (i + 1)) + char + str.substring(i + 1);
let isDigit = (char) => digitRegex.test(char);
let isOperator = (char) => operatorRegex.test(char);

function copyToClipboard() {
    if (resultDisplay != '|') {
        navigator.clipboard.writeText(backspace(resultElement.innerHTML));
        alert("Copied to clipboard!");
    }  
}

function solve(expressionStr) {
    expressionStr = expressionStr.replaceAll('÷', '/');
    expressionStr = expressionStr.replaceAll('×', '*');

    return math.evaluate(expressionStr).toString();
}

function inputClick(button) {       // handles button presses
    let pressedButton = button.innerHTML;
    let lastCharacterTyped = expression[expression.length - 1];
    
    if (pressedButton == 'C') {     // Clear Button
        expression = '0';
        resultDisplay = '|';
        allowAppending = false;
        equalPressed = false;
    }
    else if (pressedButton == '⇦') {        // Backspace
        expression = expression.length > 1 ? backspace(expression) : '0';
        if (equalPressed) {
            equalPressed = false;
            allowAppending = true;
        }
    }
    else if (pressedButton == '+/-') {
        resultDisplay = 'under development 🤷‍♂️️';
/*      
        let lastNonDigitIndex = expression.search(inversionRegex);
        let lastNonDigit = expression[lastNonDigitIndex];

        if (isOperator(lastNonDigit)) {
            if (lastNonDigit == '-') {
                expression = isOperator(expression[lastNonDigitIndex - 1]) || expression[lastNonDigitIndex - 1] == null ? replaceCharAtIndex(expression, lastNonDigitIndex, '') : replaceCharAtIndex(expression, lastNonDigitIndex, '+');
            }
            else if (lastNonDigit == '+') {
                expression = replaceCharAtIndex(expression, lastNonDigitIndex, '-');
            }
            else {
                expression = appendCharAtIndex(expression, lastNonDigitIndex, '-');
            }
        }
        else {
            expression = '-' + expression.substring(0);
        }
*/
    }
    else if (pressedButton == '=') {
        try {
            let result = solve(expression);

            expression = result;
            resultDisplay = `${result}|`;
            allowAppending = false;
            equalPressed = true;
        }
        catch (error) {
            if (error.name == 'SyntaxError'){
                resultDisplay = 'Malformed Expression|';
            }
            else {
                console.log(`Name: ${error.name}
                    Message: ${error.message}`);
                resultDisplay = 'Error';
            }
        }
    }
    else if (expression.length < 20) {  // limits the character amount on the display
        if (isDigit(pressedButton)) {
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
        else if (pressedButton == '%') {
            resultDisplay = 'under development 🤷‍♂️️';
        }
        else {  // handles the operators
            if (equalPressed) {
                equalPressed = false;
                allowAppending = true;
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
    }
    else if (resultDisplay == '|') {
        resultDisplay =  "Error|";
    }
    else {
        alert('Character cap reached')
    }

    expressionElement.innerHTML = expression;
    resultElement.innerHTML = resultDisplay; 
}
