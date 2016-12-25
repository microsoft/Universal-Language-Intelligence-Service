var _ = require('underscore');
var request = require('request-promise');
var Promise = require('promise');

// Retreive the first intent from a LUIS api
function scoreIntent(modelUrl, text, threshold) {

  threshold = threshold || 0;
  return new Promise((resolve, reject) => {
    request(modelUrl + encodeURIComponent(text),{ json: true})
      .then((result)=> {
        var json = result;

        if (!json || !json.intents || !json.intents.length) return resolve();

        // In case when minumum score is required, enforce minimum score
        if (json.intents[0].score < threshold) return resolve();

        var intent = json.intents[0];
        intent.entities = json.entities;
        return resolve(intent);
      })
      .catch(reject);
  });
}

module.exports = {
  scoreIntent: scoreIntent
};