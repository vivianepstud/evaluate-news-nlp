const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const fetch = require('node-fetch');
const bodyParser = require('body-parser');
const mockAPIResponse = require('./mockAPI.js');

function createLink(url, params) {
    return url + (url.indexOf('?') > -1 ? '&' : '?') + params.join('&');
};

dotenv.config();
const app = express();
const baseUrl = 'https://api.meaningcloud.com/sentiment-2.1';
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static('dist'));

console.log(__dirname);


app.get('/', function(req, res) {
    res.sendFile(path.resolve('/dist/index.html'));
});

// designates what port the app will listen to for incoming requests
app.listen(8081, () => {
    console.log('Example app listening on port 8080!');
});

app.get('/test', (req, res) => {
    res.send(mockAPIResponse);
});
app.post('/sentimentAnalysis', (req, res) => {
    const { body } = req;
    const urlToBeAnalysed = body.url;
    const params = [
        `key=${process.env.API_KEY}`,
        'of=json',
        `url=${encodeURIComponent(urlToBeAnalysed)}`,
        'lang=auto',
    ];
    const completeLink = createLink(baseUrl, params);
    console.log(`Requesting ${completeLink}`);
    /* fetch(urlToBeAnalysed)
        .then((response) => {
            console.log("URL fetched");
            console.log(response.status);
            if (response.status === 200) {
                return ;
            }
            Promise.reject('Invalid_URL');
        }) */
    fetch(completeLink, { method: 'POST' })
        .then((res) => {
            if (res.status !== 200) {
                console.log("Request not possible");
                return Promise.reject(new Error('MeaningCloud_Unavailable'));
            }
            return res.json();
        })
        .then((json) => {
            if (json.status.code === '0') {
                return res.send({
                    url: body.url,
                    agreement: json.agreement,
                    subjectivity: json.subjectivity,
                    confidence: json.confidence,
                    irony: json.irony,
                });
            }
            return Promise.reject(new Error(json.status.msg));
        }).catch((error) => {
            console.log(error);
            res.send({
                error: error.message,
            });
        });
});