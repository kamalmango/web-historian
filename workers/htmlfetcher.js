// Use the code in `archive-helpers.js` to actually download the urls
// that are waiting.
var CronJob = require('cron').CronJob;
var helpers = require('../helpers/archive-helpers');

var downloadFiles = function() {
  helpers.readListOfUrls(function(urls) {
    helpers.downloadUrls(urls);
  });
};

new CronJob('* * * * * ', downloadFiles, null, true, 'America/Los_Angeles');
