var baseCurrency = document.body.querySelector('#base_currency');
var relativeCurrency = document.body.querySelector('#relative_currency');
var valueBox = document.body.querySelector('#value_box');
var inputBox = document.body.querySelector('#value_input');
var currencyLists = document.body.querySelectorAll('.country_drop_down');
var dateSelector = document.body.querySelector('#date_selector');
var inputValue = Number(inputBox.value);
var currencies = {"CAD": "Canadian Dollar","HKD": "Hong Kong Dollar","ISK": "Icelandic Krona","PHP": "Philippine Pesa","DKK": "Danish Krone",
                    "HUF": "Hungarian Forint","CZK": "Czech Koruna","AUD": "Australian Dollar","RON": "Romanian Leu","SEK": "Swedish Krona",
                    "IDR": "Indian Rupee", "INR": "Indonesian Rupiah","BRL": "Brazilian Real","RUB": "Russian Rouble","HRK": "Croatian Kuna",
                    "JPY": "Japanese Yen","THB": "Thai Baht","CHF": "Swiss Franc","SGD": "Singapore Dollar","PLN": "Polish Zloty","BGN": "Bulgarian Lev",
                    "TRY": "Turkish Lira","CNY": "Chinese Yuan Renminbi","NOK": "Norwegian Krone","NZD": "New Zealand Dollar","ZAR": "South African Rand",
                    "USD": "United States Dollar","MXN": "Mexican Peso","ILS": "Israeli Shekel","GBP": "Pound Sterling","KRW": "South Korean Won",
                    "MYR": "Malaysian Ringgit", "EUR": "European Euro"};

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
    currencyNames = Object.keys(currencies);
    currencyNames.sort();
    for (var list of currencyLists) {
        for (const currency of currencyNames) {
            list.innerHTML += ('<option value="' + currency + '">' + currency + 
                ' - ' + currencies[currency] + '</option>');
        }
    }
    currencyLists[1].value = currencyLists[1].options[1].value;
}

// update value
async function updateValue() {
    if (inputBox.validity.valid == false) {
        valueBox.value = "Invalid: Please Enter a Number";
    } else {
        var baseCurrencyName = baseCurrency.options[baseCurrency.selectedIndex].value;
        var relativeCurrencyName = relativeCurrency.options[relativeCurrency.selectedIndex].value;
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

function swapCurrencies() {
    var baseCurrencyName = baseCurrency.options[baseCurrency.selectedIndex].value;
    var relativeCurrencyName = relativeCurrency.options[relativeCurrency.selectedIndex].value;
    var temp = baseCurrencyName;
    baseCurrency.value = relativeCurrencyName;
    relativeCurrency.value = temp;
    updateValue();
}

baseCurrency.addEventListener('change', (event) => {
    var baseCurrencyName = baseCurrency.options[baseCurrency.selectedIndex].value;
    var relativeCurrencyName = relativeCurrency.options[relativeCurrency.selectedIndex].value
    if (baseCurrencyName == relativeCurrencyName) {
        let nextOption = (relativeCurrency.selectedIndex += 1) %  currencies.length;
        relativeCurrency.value = relativeCurrency.options[nextOption].value;
    }
});

relativeCurrency.addEventListener('change', (event) => {
    var baseCurrencyName = baseCurrency.options[baseCurrency.selectedIndex].value;
    var relativeCurrencyName = relativeCurrency.options[relativeCurrency.selectedIndex].value
    if (baseCurrencyName == relativeCurrencyName) {
        let nextOption = (baseCurrency.selectedIndex += 1) %  currencies.length;
        baseCurrency.value = baseCurrency.options[nextOption].value;
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
