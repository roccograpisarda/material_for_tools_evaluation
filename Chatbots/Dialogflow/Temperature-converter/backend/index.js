const express = require('express');
const { WebhookClient, Suggestion } = require('dialogflow-fulfillment');

const app = express();

app.use(express.json());

app.post('/dialogflow-fulfillment', (req, res) => {
  const agent = new WebhookClient({ request: req, response: res });

  function welcome(agent) {
    agent.add('Welcome to the temperature converter!');
    agent.add('I can convert Celsius to Fahrenheit and Fahrenheit to Celsius! What temperature would you like to convert?');
    agent.add(new Suggestion('27° Celsius'));
    agent.add(new Suggestion('-40° Fahrenheit'));
    agent.add(new Suggestion('Cancel'));
  }

  function convertFahrenheitAndCelsius(agent) {
    const temperature = agent.parameters.temperature;
    const unit = agent.parameters.unit;

    let convertedTemp, convertedUnit;
    if (unit === 'Celsius') {
      convertedTemp = temperature * (9 / 5) + 32;
      convertedUnit = 'Fahrenheit';
    } else if (unit === 'Fahrenheit') {
      convertedTemp = (temperature - 32) * (5 / 9);
      convertedUnit = 'Celsius';
    }

    agent.context.set({
      name: 'temperature',
      lifespan: 1,
      parameters: { temperature: temperature, unit: unit }
    });

    agent.add(`${temperature}° ${unit} is ${convertedTemp}° ${convertedUnit}`);
    agent.add('Would you like to know what this temperature is in Kelvin or Rankine?');
    agent.add(new Suggestion('Kelvin'));
    agent.add(new Suggestion('Rankine'));
    agent.add(new Suggestion('Cancel'));
  }

  function convertRankineAndKelvin(agent) {
    const secondUnit = agent.parameters.absoluteTempUnit;
    const tempContext = agent.context.get('temperature');
    const originalTemp = tempContext.parameters.temperature;
    const originalUnit = tempContext.parameters.unit;

    let convertedTemp, convertedUnit;
    if (secondUnit === 'Kelvin') {
      convertedTemp = originalTemp === 'Celsius' ? originalTemp + 273.15 : (originalTemp - 32) * (5 / 9) + 273.15;
      convertedUnit = 'Kelvin';
    } else if (secondUnit === 'Rankine') {
      convertedTemp = originalTemp === 'Fahrenheit' ? originalTemp + 459.67 : originalTemp * (9 / 5) + 32 + 459.67;
      convertedUnit = 'Rankine';
    }

    agent.context.set({ name: 'temperature', lifespan: 0 });

    agent.add(`${originalTemp}° ${originalUnit} is ${convertedTemp}° ${convertedUnit}. `);
    agent.add('Go ahead and say another temperature to get the conversion.');
    agent.add(new Suggestion('27° Celsius'));
    agent.add(new Suggestion('-40° Fahrenheit'));
    agent.add(new Suggestion('Cancel'));
  }

  function fallback(agent) {
    agent.add('Woah! It\'s getting a little hot in here.');
    agent.add(`I didn't get that, can you try again?`);
  }

  let intentMap = new Map();
  intentMap.set('Default Welcome Intent', welcome);
  intentMap.set('Convert Fahrenheit and Celsius', convertFahrenheitAndCelsius);
  intentMap.set('Convert Rankine and Kelvin', convertRankineAndKelvin);
  intentMap.set('Default Fallback Intent', fallback);

  agent.handleRequest(intentMap);
});


const port = parseInt(process.env.PORT) || 8080;

app.listen(port, () => {
    console.log(`Listening on port ${port}`)
})
