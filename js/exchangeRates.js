const URL = 'https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?json';
const USD_ID = 25;
const EUR_ID = 32;
let courseUSD = 0;
let courseEUR = 0;

let leftInput = document.querySelector('#input-left');
let rightInput = document.querySelector('#input-right');
let leftSelect = document.querySelector('#left-select');
let rightSelect = document.querySelector('#right-select');

async function showExchangeRate(currency) {
    let response = await fetch(URL);
    let json = await response.json();
    let val = json[currency];

    if (currency === USD_ID) courseUSD = +val.rate.toFixed(2)
    else if (currency === EUR_ID) courseEUR = +val.rate.toFixed(2);

    document.querySelector('.currency').outerHTML +=
        `<p>${val.cc} (${val.txt}): ${val.rate.toFixed(2)}</p>`;
}

function convertСurrency(num, position) {
    if (num < 0) return 0;

    let leftSelected = document.getElementById('left-select').selectedIndex;
    let rightSelected = document.getElementById('right-select').selectedIndex;

    /* leftSelected: 0 (USD), 1 (USD), 2 (UAH); rightSelected: 0 (UAH), 1 (USD), 2 (EUR); */

    if (rightSelected === 0) {
        if (leftSelected === 0) return (position === 'left') ? num * courseUSD : num / courseUSD;
        if (leftSelected === 1) return (position === 'left') ? num * courseEUR : num / courseEUR;
        if (leftSelected === 2) return +num;
    } else if (rightSelected === 1) {
        if (leftSelected === 0) return +num;
        if (leftSelected === 1) return (position === 'left') ? courseEUR / courseUSD * num : courseUSD / courseEUR * num;
        if (leftSelected === 2) return (position === 'left') ? num / courseUSD : num * courseUSD;
    } else if (rightSelected === 2) {
        if (leftSelected === 0) return (position === 'left') ? courseUSD / courseEUR * num : courseEUR / courseUSD * num;
        if (leftSelected === 1) return +num;
        if (leftSelected === 2) return (position === 'left') ? num / courseEUR : num * courseEUR;
    }
}

function changeRightInputValue() {
    rightInput.value = convertСurrency(leftInput.value, 'left').toFixed(2);
}

function changeLeftInputValue() {
    leftInput.value = convertСurrency(rightInput.value, 'right').toFixed(2);
}

showExchangeRate(EUR_ID);
showExchangeRate(USD_ID);

rightInput.oninput = changeLeftInputValue;
leftInput.oninput = changeRightInputValue;

leftSelect.onchange = changeRightInputValue;
rightSelect.onchange = changeLeftInputValue;