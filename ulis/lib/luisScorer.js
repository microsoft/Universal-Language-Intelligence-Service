var _ = require('underscore');
var request = require('request-promise');
var Promise = require('promise');

// Retreive the first intent from a LUIS api
function scoreIntent(modelUrl, text, threshold) {

  threshold = threshold || 0;
  return new Promise(function (resolve, reject) {
    request(modelUrl + encodeURIComponent(text))
      .then(function (result) {
        var json = JSON.parse(result);

        if (!json || !json.intents || !json.intents.length) return resolve(null);

        // In case when minumum score is required, enforce minimum score
        if (json.intents[0].score < threshold) return resolve(null);

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