const express = require('express');
const app = express();
const dfff = require('dialogflow-fulfillment');
const axios = require('axios');


// Retrieve your API key here: https://www.exchangerate-api.com/
const api_key = '8bba35f2df3aa2260acf4c4b';

let currency1 = "";
let currency2 = "";
let amount = 0;

// check if the service works
app.get('/', (req, res) => {
    res.send("Hello world")
});


// Retrieve the currency value.
app.post('/dialogflow-fulfillment', express.json(), (req, res) => {
    const agent = new dfff.WebhookClient({
        request: req,
        response: res
    });

    async function currencyConvert(agent) {
        currency1 = agent.parameters['currency-from'];
        currency2 = agent.parameters['currency-to'];
        amount = agent.parameters['amount'];
        // call the api only if all the parameters are not null
        if (currency1 && currency2 && amount) {
            const url = `https://v6.exchangerate-api.com/v6/${api_key}/pair/${currency1}/${currency2}/${amount}`;

            try {
                var value_changed = (await getCurrencyValue(url)).conversion_result;
                agent.add(`At the moment ${amount}${currency1} are ${value_changed}${currency2}`);
            } catch (error) {
                console.error(error);
                agent.add('An error occurred while fetching currency value');
            }
        } else {
            agent.add('Invalid currency conversion parameters');
        }
    }

    var intentMap = new Map();
    intentMap.set('currency.convert', currencyConvert);
    intentMap.set('currency.convert - context:convert-currency', currencyConvert);

    agent.handleRequest(intentMap);


})

async function getCurrencyValue(url) {
    try {
        var response = await axios.get(url);
        console.log(response.data); // Log the response data
        return response.data; // Return the response data
    } catch (error) {
        console.error(error);
        throw new Error('An error occurred while fetching currency value');
    }
}

const port = parseInt(process.env.PORT) || 8080;

app.listen(port, () => {
    console.log(`Listening on port ${port}`)
})

