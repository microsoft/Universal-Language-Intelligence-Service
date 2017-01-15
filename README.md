# Universal Language Intelligence Service
A wrapper for the Microsoft LUIS cognitive that provides universal language support (after training) using the bing translate api 

## Pre-Requisites
- LUIS Account 
- Bing Translate Key
- Add keys to the configuration file

## Installation

    $ npm install ulis

## To Train Language Model (See Provided Hebrew Example)

1. Upload natural language samples to LUIS using either the testTrainBot or the Batch insertion tool
2. Tag translation intents and entities

## To Use
```js
var ulis = require('ulis');

//Setup ulisClient using client id and secret
var ulisClient = new ulis.getClient({
    lang:'he',
    bingTranslate_clientId: 'TRANSLATE_CLIENT_ID',
    bingTranslate_secret: 'TRANSLATE_CLIENT_SECRET',
    luisURL: 'LUIS_ENDPOINT'
});

//Or setup ulisClient using translate api_key from azure portal
var ulisClient = new ulis.getClient({
    lang:'he',
    bingTranslate_api_key:'TRANSLATE_API_KEY',
    luisURL: 'LUIS_ENDPOINT'
});

//Make a query
 ulisClient.query('אפשר לקבוע תור למחר', (err, ulisRes) => {
    if (err) return console.log(err.message);       
    console.log(`Translated As: " ${ulisRes.translatedText} "\n\nLUIS Intent: " ${ulisRes.intent} " \n\nLUIS Entities \n\n"  ${JSON.stringify(ulisRes.entities)}`);
});

```