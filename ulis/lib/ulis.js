//ulis is the Universal Langauge Intent Service wrapper for microsoft luis using the bing translate api to use see online documentation 

var MsTranslator = require('mstranslator');
var luisScorer = require('./luisScorer')
var franc = require('franc');
var langs = require('langs');

function getClient(opts) {

	var lang = opts.lang;
	if (!lang) throw new Error('Please provide a model language such as he');
	
	var translateClient;

    if (opts.bingTranslate_api_key){
		translateClient = new MsTranslator({
		api_key: opts.bingTranslate_api_key // use this for the new token API. 
		}, true);
	}
	else if (!opts.bingTranslate_clientId || !opts.bingTranslate_secret) throw new Error('Please provide bing translate clientId and secret or api_key')
	else {
		translateClient = new MsTranslator({
		client_id: opts.bingTranslate_clientId,
		client_secret: opts.bingTranslate_secret
		}, true);
	}
	var luisURL = opts.luisURL;
	if (!luisURL) throw new Error('Please provide a LUIS model optimized for the provided language');


	function query(text, cb) {

		if (!cb) return new Error('Please provide a callback to process the returned response');
		if (!text) return cb(new Error('Please provide a text'));

		//confirm language: requires conversion between iso-639-3 (lang3)  and iso-639-1
		var lang3 = langs.where("1", lang)['3'];
		var detectedLang = franc.all(text,{'whitelist' : ['eng',lang3], 'minLength': 3})[0][0];
		console.log(`${detectedLang} detected`);
		if (detectedLang != lang3 ){
			if ( detectedLang != 'eng'){
				return cb(new Error('Sorry we don\'t support that language at the moment.'));
			}
		}

		translate(text, (err, translatedText) => {
			if (err) return cb(err);
			sendToLuis(translatedText, (err, luisResponse) => {
				if (err) return cb(err);
				luisResponse.translatedText = translatedText; 
				return cb(null, luisResponse);
			});
		});
	}

	function translate(text, cb) {

		var params = {
			text: text,
			from: lang,
			to: 'en'
		};

		console.log(`Translating: ${text}`);

		translateClient.translate(params, (err, translation) => { 
			if (err) {
				console.error(`Error translating: ${err.message}`);
				return cb(err);
			}
			//write textToTranslate and translation to csv 
			console.log(`Translating completed: ${text}:${translation}`);
			return cb(null, translation);		
		});
		
	}

	function sendToLuis(text, cb) {
		console.log(`Sending to Luis: ${text}`);

		luisScorer.scoreIntent(luisURL,text)
		.then((luisResponse) => {
			console.log(`Sending to Luis completed: ${text}`);
			return cb(null, luisResponse);		
		})
		.catch(err => {
			console.error(`Error sending to LUIS: ${err.message}`);
			return cb(err)
		});
	}

	return {
		query
	}

}

module.exports = {
	getClient
};
