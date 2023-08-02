const express = require('express');
const cors = require('cors');
const port = 4000;
const app = express();
const axios = require('axios');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');


dotenv.config();
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

const { OpenAIApi, Configuration } = require("openai");

const configuration = new Configuration({
    organization: process.env.ORGANIZATION_KEY,
    apiKey: process.env.API_KEY,
});
app.use(express.static('public'));
const openai = new OpenAIApi(configuration);

app.use(cors({
    origin: 'http://localhost:3000',
    methods: 'GET,POST,PUT,DELETE',
    allowedHeaders: ['Content-Type'],
  }));

app.post('/', async (req, res) => {
    try {
        const messages = [
            { role: 'system', content: 'You are a highly renowned health and nutrition expert FitnessGPT.' },
            { role: 'user', content: req.body.message }
        ];
        const response = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages,
            temperature: 1,
            max_tokens: 2500,
            n: 1,
        });
        console.log(req.body.message );
       
        res.send(response.data.choices[0].message.content);
    } catch (error) {
        console.error(error.response.data);
        res.status(500).send('An error occurred');
    }
});


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

module.exports = app;