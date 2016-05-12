var fs = require('fs');
var path = require('path');
var _ = require('underscore');

/*
 * You will need to reuse the same paths many times over in the course of this sprint.
 * Consider using the `paths` object below to store frequently used file paths. This way,
 * if you move any files, you'll only need to change your code in one place! Feel free to
 * customize it in any way you wish.
 */

exports.paths = {
  siteAssets: path.join(__dirname, '../web/public'),
  archivedSites: path.join(__dirname, '../archives/sites'),
  list: path.join(__dirname, '../archives/sites.txt')
};

// Used for stubbing paths for tests, do not modify
exports.initialize = function(pathsObj) {
  _.each(pathsObj, function(path, type) {
    exports.paths[type] = path;
  });
};

// The following function names are provided to you to suggest how you might
// modularize your code. Keep it clean!

exports.readListOfUrls = function(cb) {
  fs.readFile(this.paths.list, 'utf8', function(err, data) {
    cb(data.split('\n'));
  });
};

exports.isUrlInList = function(url, cb) {
  this.readListOfUrls(function(items) {
    var result = false;
    items.forEach(function(item) {
      if (item === url) {
        result = true;
      }
    });
    cb(result);
  });
};

exports.addUrlToList = function(url, cb) {
  fs.appendFile(this.paths.list, path.join(url, '\n'), function(error) {
    if (error) {
      throw error;
    } else {
      cb();
    }
  });
};

exports.isUrlArchived = function(url, cb) {
  fs.readdir(this.paths.archivedSites, function(err, files) {
    var results = false;
    files.forEach(function(file) {
      if (file === url) {
        results = true;
      }
    });
    cb(results);
  });
};

exports.downloadUrls = function(urls) {
  urls.forEach(function(url) {
    writeFile(path.join(exports.paths.archivedSites, url), url, function(err) {
      if (err) {
        throw err;
      }
    }); 
  }); 
};






