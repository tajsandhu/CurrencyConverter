var baseCurrency = document.body.querySelector('#base_currency');
var relativeCurrency = document.body.querySelector('#relative_currency');
var valueBox = document.body.querySelector('#value_box');
var inputBox = document.body.querySelector('#value_input');
var currencyLists = document.body.querySelectorAll('.country_drop_down');
var inputValue = Number(inputBox.value);
var currencies = ["CAD","HKD","ISK","PHP","DKK","HUF","CZK","AUD","RON","SEK","IDR", 
                        "INR","BRL","RUB","HRK","JPY","THB","CHF","SGD","PLN","BGN","TRY",
                        "CNY","NOK","NZD","ZAR","USD","MXN","ILS","GBP","KRW","MYR", "EUR"];

// gets a list of all currencies available from the European Central Bank
async function fillCurrencies() {
    currencies.sort();
    for (var list of currencyLists) {
        for (const currency of currencies) {
            list.innerHTML += ('<option value="' + currency + '">' + currency + '</option>');
        }
    }
    currencyLists[1].value = currencyLists[1].options[1].text;
}

// update value
async function updateValue() {
    var baseCurrencyName = baseCurrency.options[baseCurrency.selectedIndex].text;
    var relativeCurrencyName = relativeCurrency.options[relativeCurrency.selectedIndex].text;
    await fetch('https://api.exchangeratesapi.io/latest?base=' + baseCurrencyName
        + '&symbols=' + relativeCurrencyName)
        .then(response => response.json())
        .then(data => {
            valueBox.innerHTML = (data['rates'][relativeCurrencyName] * inputValue).toFixed(2);
        });
}

// adds these currencies to the drop down lists
fillCurrencies()
    .then( () => updateValue());

baseCurrency.addEventListener('change', (event) => {
    var baseCurrencyName = baseCurrency.options[baseCurrency.selectedIndex].text;
    var relativeCurrencyName = relativeCurrency.options[relativeCurrency.selectedIndex].text
    if (baseCurrencyName == relativeCurrencyName) {
        let nextOption = (relativeCurrency.selectedIndex += 1) %  currencies.length;
        relativeCurrency.value = relativeCurrency.options[nextOption].text;
    }
});

relativeCurrency.addEventListener('change', (event) => {
    var baseCurrencyName = baseCurrency.options[baseCurrency.selectedIndex].text;
    var relativeCurrencyName = relativeCurrency.options[relativeCurrency.selectedIndex].text
    if (baseCurrencyName == relativeCurrencyName) {
        let nextOption = (baseCurrency.selectedIndex += 1) %  currencies.length;
        baseCurrency.value = baseCurrency.options[nextOption].text;
    }
});


// displays the value of the base currency in the relative currency
baseCurrency.onchange = updateValue;
relativeCurrency.onchange = updateValue;
inputBox.addEventListener('input', (event) => {
    inputValue = Number(event.target.value);
    updateValue();
});