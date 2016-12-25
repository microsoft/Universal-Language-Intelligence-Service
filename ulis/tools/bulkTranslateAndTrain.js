var fs = require('fs');
var path = require('path');
var lineReader = require('line-reader');

var filepath = path.join(__dirname, 'hebrew.csv');
var output = path.join(__dirname, 'hebrew.out.csv');

var outStream = fs.createWriteStream(output);

var ulis = require('../lib/ulis');
var config = require('./config');

//setup ulisClient
var ulisClient = new ulis.getClient({
    lang:'he',
    bingTranslate_clientId: config.get('TRANSLATE_CLIENT_ID'),
    bingTranslate_secret: config.get('TRANSLATE_CLIENT_SECRET'),
    luisURL: config.get('LUIS_ENDPOINT')
});

lineReader.eachLine(filepath,(line, last, cb) => {
    
	ulisClient.query(line, (err, ulisResponse) => {
		if (err) {
			console.error(`error translating: ${err.message}`);
			return cb(err);
		}

		outStream.write(`${line}, ${ulisResponse.translatedText}\n`, () => {
			if (last) {
				outStream.close();
				console.log('done');
			}
			else return cb();
		});
	});
});