var ulis = require('../lib/ulis');
var config = require('./config');

//setup ulisClient
var ulisClient = new ulis.getClient({
    lang:'he',
    bingTranslate_clientId: config.get('TRANSLATE_CLIENT_ID'),
    bingTranslate_secret: config.get('TRANSLATE_CLIENT_SECRET'),
    luisURL: config.get('LUIS_ENDPOINT')
});

 ulisClient.query('אפשר לקבוע תור למחר', function(err, ulisRes) {
    if (err) {
        Console.log(err.message);
        return;        
    }
    Console.log("Translated As: "+ ulisRes.translatedText+ "\n\nLUIS Intent: " + ulisRes.intent + " \n\nLUIS Entities \n\n" + JSON.stringify(ulisRes.entities));
});
