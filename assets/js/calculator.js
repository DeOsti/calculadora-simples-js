const currValue = document.querySelector(".current-value");
const lastValue = document.querySelector(".last-value");
const calcButtons = document.querySelectorAll(".calc-buttons-col > button");

const validKeys = "0123456789/*-+%.=";

let init = true;

calcButtons.forEach((ele) => {
    ele.addEventListener("click", () => {
        updateDisplay(ele.dataset.btnValue, init);
    });
});

document.addEventListener("keydown", (e) => {
    if (validKeys.includes(e.key)) {
        updateDisplay(e.key);
        return;
    }
    if (e.key === ",") {
        updateDisplay(".");
        return;
    }
    if (e.key === "Enter") {
        updateDisplay("=");
        return;
    }
    if (e.key === "Backspace" || e.key === "Delete") {
        updateDisplay("D");
        return;
    }
    if (e.key === "Escape") {
        updateDisplay("C");
        return;
    }
});

function isValidInput(value) {
    const lastChar = currValue.textContent.substring(currValue.textContent.length - 1);
    if (currValue.textContent === "0") {
        if (lastValue.textContent === "0" && "0CD%=/*-+".includes(value)) return false;
        if ("0D%=".includes(value)) return false;
    }

    if (value === ".") {
        for (char of currValue.textContent) {
            if (char === ".") return false;
        }
    }

    if (lastChar === "." && "/*-+".includes(value)) return false;

    return true;
}

function updateDisplay(value, initFlag) {
    if (initFlag) {
        if (!"/*-+".includes(value)) {
            calcReset();
        }
    }
    if (isValidInput(value)) {
        const curr = currValue.textContent;
        const last = lastValue.textContent;
        if (curr === "0") {
            if (value === ".") {
                currValue.textContent += value;
                return;
            }
            if (value === "C") {
                calcReset();
                return;
            }
            if ("/*-+".includes(value)) {
                lastValue.textContent = `${last.substring(0, last.length - 1)}${value}`;
                return;
            }
            currValue.textContent = value;
            return;
        }
        if ("0123456789.".includes(value)) {
            currValue.textContent += value;
            return;
        }
        if ("/*-+".includes(value)) {
            const res = calculate(curr, last, value);
            currValue.textContent = "0";
            lastValue.textContent = res;
            init = false;
            return;
        }
        if (value === "%") {
            const res = calculate(curr, last, value);
            currValue.textContent = res;
            return;
        }
        if (value === "=") {
            const res = calcResult(curr, last);
            currValue.textContent = res;
            lastValue.textContent = "0";
            init = true;
            return;
        }
        if (value === "D") {
            if (curr.length === 1) {
                currValue.textContent = 0;
                return;
            }
            currValue.textContent = curr.substring(0, curr.length - 1);
            return;
        }

        if (value === "C") {
            calcReset();
            return;
        }
    }
}

function calculate(curr, last, operator) {
    const oldOperator = last.substring(last.length - 1);
    const isZero = oldOperator === "0" ? true : false;

    if (operator === "%") {
        return `${parseFloat(curr) * 0.01}`;
    }

    switch (oldOperator) {
        case "+":
            return `${parseFloat(last) + parseFloat(curr)} ${operator}`;
        case "-":
            return `${parseFloat(last) - parseFloat(curr)} ${operator}`;
        case "*":
            return isZero
                ? `${parseFloat(curr)} *`
                : `${parseFloat(last) * parseFloat(curr)} ${operator}`;
        case "/":
            return isZero
                ? `${parseFloat(curr)} /`
                : `${parseFloat(last) / parseFloat(curr)} ${operator}`;
        default:
            return `${parseFloat(curr)} ${operator}`;
    }
}

function calcResult(curr, last) {
    const oldOperator = last.substring(last.length - 1);
    switch (oldOperator) {
        case "+":
            return `${parseFloat(last) + parseFloat(curr)}`;
        case "-":
            return `${parseFloat(last) - parseFloat(curr)}`;
        case "*":
            return `${parseFloat(last) * parseFloat(curr)}`;
        case "/":
            return `${parseFloat(last) / parseFloat(curr)}`;
        default:
            return `${parseFloat(last) + parseFloat(curr)}`;
    }
}

function calcReset() {
    currValue.textContent = "0";
    lastValue.textContent = "0";
    init = false;
}
