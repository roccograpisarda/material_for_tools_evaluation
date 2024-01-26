const express = require('express');
const app = express();
const { WebhookClient, Card, Suggestion } = require('dialogflow-fulfillment');
const axios = require('axios');


// Retrieve your API key here: https://newsapi.org/
const api_key = '############'

let news_type = "";
let country = "";


app.get('/', (req, res) => {
    res.send("Hello world")
});


app.post('/dialogflow-fulfillment', express.json(), (req, res) => {
    const agent = new WebhookClient({
        request: req,
        response: res
    });

    async function RetriveNews(agent) {
        news_type = agent.parameters['news-type'];
        country = agent.parameters['news-country']['alpha-2'];
        // call the api only if all the parameters are not null
        if (news_type && country) {
            const urlCall = `https://newsapi.org/v2/top-headlines?country=${country}&category=${news_type}&apiKey=${api_key}`;

            try {
                const { author, title, url } = (await getNews(urlCall));
                const card = new Card({
                    title: title,
                    imageUrl: "https://cdn.pixabay.com/photo/2016/09/04/17/46/news-1644696_960_720.png",
                    text: `Author: ${author}`,
                    buttonText: 'Read More',
                    buttonUrl: url
                });

                agent.add(`Here you are!`);
                agent.add(card);
                agent.add(new Suggestion('Another news'));

            } catch (error) {
                console.error(error);
                agent.add('An error occurred while fetching data');
            }
        } else {
            agent.add('Invalid parameters');
        }
    }

    var intentMap = new Map();
    intentMap.set('News', RetriveNews);

    agent.handleRequest(intentMap);


})

async function getNews(url) {
    try {
        const response = await axios.get(url);
        if (response.data.status === 'ok' && response.data.articles.length > 0) {
            const firstElement = response.data.articles[0];
            const { author, title, url } = firstElement;
            return { author, title, url };
        } else {
            console.log('No articles found.');
        }
    } catch (error) {
        console.error('Error fetching data:', error.message);
    }
}

const port = parseInt(process.env.PORT) || 8080;

app.listen(port, () => {
    console.log(`Listening on port ${port}`)
})

