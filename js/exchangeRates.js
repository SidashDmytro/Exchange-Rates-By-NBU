const URL = 'https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?json';
const USD_ID = 25;
const EUR_ID = 32;
let courseUSD = 0;
let courseEUR = 0;
let leftSelectedItem = 0;
let rightSelectedItem = 2;

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

function convertCurrency(num, convertFrom, convertTo) {
    if (num < 0) return 0;

    let from = convertFrom.selectedIndex;
    let to = convertTo.selectedIndex;

    if (from === 0) { // selected USD
        if (to === 0) return +num;
        if (to === 1) return courseUSD / courseEUR * num;
        if (to === 2) return num * courseUSD;
    } else if (from === 1) { // selected EUR
        if (to === 0) return courseEUR / courseUSD * num;
        if (to === 1) return +num;
        if (to === 2) return num * courseEUR;
    } else if (from === 2) { // selected UAH
        if (to === 0) return num / courseUSD;
        if (to === 1) return num / courseEUR;
        if (to === 2) return +num;
    }
}

function changeInputValue(leftToRight) {
    if (leftSelect.selectedIndex === rightSelect.selectedIndex) {
        if (leftToRight) {
            rightSelect.selectedIndex = leftSelectedItem;
        } else {
            leftSelect.selectedIndex = rightSelectedItem;
        }
    } // If the same currency is selected, swap them
    leftSelectedItem = leftSelect.selectedIndex;
    rightSelectedItem = rightSelect.selectedIndex;

    if (leftToRight) {
        rightInput.value = convertCurrency(leftInput.value, leftSelect, rightSelect).toFixed(2);
    } else {
        leftInput.value = convertCurrency(rightInput.value, rightSelect, leftSelect).toFixed(2);
    }
}

showExchangeRate(EUR_ID);
showExchangeRate(USD_ID);

rightInput.oninput = () => changeInputValue(false);
leftInput.oninput = () => changeInputValue(true);

leftSelect.onchange = () => changeInputValue(true);
rightSelect.onchange = () => changeInputValue(false);