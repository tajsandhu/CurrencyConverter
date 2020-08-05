var baseCurrency = document.body.querySelector('#base_currency');
var relativeCurrency = document.body.querySelector('#relative_currency');
var valueBox = document.body.querySelector('#value_box');
var inputBox = document.body.querySelector('#value_input');
var currencyLists = document.body.querySelectorAll('.country_drop_down');
var dateSelector = document.body.querySelector('#date_selector');
var inputValue = Number(inputBox.value);
var currencies = ["CAD","HKD","ISK","PHP","DKK","HUF","CZK","AUD","RON","SEK","IDR", 
                        "INR","BRL","RUB","HRK","JPY","THB","CHF","SGD","PLN","BGN","TRY",
                        "CNY","NOK","NZD","ZAR","USD","MXN","ILS","GBP","KRW","MYR", "EUR"];

function getDate() {
    var today = new Date();
    var yyyy = today.getFullYear();
    var mm = today.getMonth() + 1;
    var dd = today.getDate();
    if (mm.length < 2)
        mm = '0' + mm;
    if (dd.length < 2)
        dd = '0' + dd;
    
    return (yyyy + '-' + mm + '-' + dd);
}

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
    if (inputBox.validity.valid == false) {
        valueBox.value = "Invalid: Please Enter a Number";
    } else {
        var baseCurrencyName = baseCurrency.options[baseCurrency.selectedIndex].text;
        var relativeCurrencyName = relativeCurrency.options[relativeCurrency.selectedIndex].text;
        var fetchRequest;
        if (dateSelector.value === '') {
            fetchRequest = 'https://api.exchangeratesapi.io/' + getDate() + '?base=';
        } else {
            fetchRequest = 'https://api.exchangeratesapi.io/' + dateSelector.value + '?base=';
        }
        await fetch(fetchRequest + baseCurrencyName + '&symbols=' + relativeCurrencyName)
            .then(response => response.json())
            .then(data => {
                valueBox.value = (data['rates'][relativeCurrencyName] * inputValue).toFixed(2);
            });
    }
    
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

dateSelector.addEventListener('change', () => {
    updateValue();
})


// displays the value of the base currency in the relative currency
baseCurrency.onchange = updateValue;
relativeCurrency.onchange = updateValue;
inputBox.addEventListener('input', (event) => {
    inputValue = Number(event.target.value);
    updateValue();
});
