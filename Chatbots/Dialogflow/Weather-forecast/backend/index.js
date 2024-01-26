const express = require('express');
const app = express();
const dfff = require('dialogflow-fulfillment');
const axios = require('axios');

// get your openweather API key here: https://openweathermap.org/api
const openWeatherApiKey = '###################';

app.use(express.json());

// Check if the service works
app.get('/', (req, res) => {
  res.send("Hello world");
});

// Retrieve the weather information.
app.post('/dialogflow-fulfillment', (req, res) => {
  const agent = new dfff.WebhookClient({
    request: req,
    response: res
  });

  async function getWeather(agent) {
    const city = agent.parameters['geo-city'];

    // Call the Geocoder API to get latitude and longitude
    try {
      const geoData = await getGeocoderData(city);
       const lat = geoData.lat;
       const lon = geoData.lon;
       const state = geoData.state;
       const country = geoData.country;


      // Call the weather API with latitude and longitude
      try {
        const weatherData = await callWeatherApi(lat, lon, state, country);
        agent.add(weatherData);
      } catch (error) {
        console.error(error);
        agent.add('An error occurred while fetching weather information');
      }
    } catch (error) {
      console.error(error);
      agent.add('An error occurred while fetching geolocation data');
    }
  }

  var intentMap = new Map();
  intentMap.set('weather', getWeather);
  intentMap.set('weather.context', getWeather);

  agent.handleRequest(intentMap);
});

async function getGeocoderData(city) {
  try {
    const response = await axios.get(`http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${openWeatherApiKey}`);
    return {
      lat: response.data[0].lat,
      lon: response.data[0].lon,
      state: response.data[0].state,
      country: response.data[0].country
    };
  } catch (error) {
    throw new Error('An error occurred while fetching geolocation data');
  }
}

async function callWeatherApi(lat, lon, state, country) {
  try {
    const response = await axios.get(`http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${openWeatherApiKey}&units=metric`);
    const currentWeather = response.data.weather[0].description;
    const temperature = response.data.main.temp;
    const location = response.data.name;
    const weatherInfo = `Current conditions in ${location}, ${state} (${country}), are ${currentWeather} with a temperature of ${temperature}°C.`;
    console.log(weatherInfo);
    return weatherInfo;
  } catch (error) {
    throw new Error('An error occurred while fetching weather information');
  }
}

const port = parseInt(process.env.PORT) || 8080;

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
