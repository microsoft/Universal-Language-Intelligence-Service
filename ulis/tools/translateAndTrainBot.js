var restify = require('restify');
var builder = require('botbuilder');
var ulis = require('../lib/ulis');
var config = require('./config');

//=========================================================
// Bot Setup
//=========================================================

//setup ulisClient
var ulisClient = new ulis.getClient({
    lang:'he',
    bingTranslate_clientId: config.get('TRANSLATE_CLIENT_ID'),
    bingTranslate_secret: config.get('TRANSLATE_CLIENT_SECRET'),
    luisURL: config.get('LUIS_ENDPOINT')
});

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, () => {
   console.log('%s listening to %s', server.name, server.url); 
});

// Create chat bot
var connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});
var bot = new builder.UniversalBot(connector);
server.post('/api/messages', connector.listen());

//=========================================================
// Bots Dialogs
//=========================================================

bot.dialog('/', [
    (session) => {
        builder.Prompts.text(session, 'שלום איך אני יכול לעזור?');
    },
    //translate
    (session, results) => {
        ulisClient.query(results.response, (err, ulisRes) => {
            if (err) {
                session.send(err.message);
                return session.endDialog();        
            }
            session.send(`Translated As: " ${ulisRes.translatedText} "\n\nLUIS Intent: " ${ulisRes.intent} " \n\nLUIS Entities \n\n"  ${JSON.stringify(ulisRes.entities)}`);
            session.endDialog();        
        });
    }

]);