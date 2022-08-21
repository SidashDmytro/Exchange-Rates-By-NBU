const url = 'https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?json';

const USD = 25;
const EUR = 32;
let courseUSD = 0;
let courseEUR = 0;

let leftInput = document.querySelector('#input-1');
let rightInput = document.querySelector('#input-2');
let leftSelect = document.querySelector('#left-select');
let rightSelect = document.querySelector('#right-select');

exchangeRate(EUR);
exchangeRate(USD);

/* вывод нужных курсов на экран */

async function exchangeRate(currency) {
    let response = await fetch(url);
    let json = await response.json();
    let val = json[currency];

    // меняем значение глобальных переменных courseUSD и courseEUR
    if (currency === USD) courseUSD = +val.rate.toFixed(2)
    else if (currency === EUR) courseEUR = +val.rate.toFixed(2);

    document.querySelector('.currency').outerHTML +=
        `<p>${val.cc} (${val.txt}): ${val.rate.toFixed(2)}</p>`;
}

function convert(num, position) {
    if (num < 0) return 0;

    let leftSelected = document.getElementById('left-select').selectedIndex;
    let rightSelected = document.getElementById('right-select').selectedIndex;

    // выбран UAH справа
    if (rightSelected === 0) {
        if (leftSelected === 0) return (position === 'left') ? num * courseUSD : num / courseUSD;
        if (leftSelected === 1) return (position === 'left') ? num * courseEUR : num / courseEUR;
        if (leftSelected === 2) return +num;
    }

    // выбран USD справа
    else if (rightSelected === 1) {
        if (leftSelected === 0) return +num;
        if (leftSelected === 1) return (position === 'left') ? courseEUR / courseUSD * num : courseUSD / courseEUR * num;
        if (leftSelected === 2) return (position === 'left') ? num / courseUSD : num * courseUSD;
    }

    // выбран EUR справа
    else if (rightSelected === 2) {
        if (leftSelected === 0) return (position === 'left') ? courseUSD / courseEUR * num : courseEUR / courseUSD * num;
        if (leftSelected === 1) return +num;
        if (leftSelected === 2) return (position === 'left') ? num / courseEUR : num * courseEUR;
    }
}



function changeRightValue() {
    rightInput.value = convert(leftInput.value, 'left').toFixed(2);
}

function changeLeftValue() {
    leftInput.value = convert(rightInput.value, 'right').toFixed(2);
}

rightInput.oninput = changeLeftValue;
leftInput.oninput = changeRightValue;

leftSelect.onchange = changeRightValue;
rightSelect.onchange = changeLeftValue;