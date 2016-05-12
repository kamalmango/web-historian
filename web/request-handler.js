var path = require('path');
var archive = require('../helpers/archive-helpers');
// require more modules/folders here!
var fs = require('fs');
var helpers = require('./http-helpers.js');

exports.handleRequest = function (req, res) {
  if (req.method === 'GET') {

    if (req.url === '/') {
      fs.readFile(path.join(archive.paths.siteAssets, '/index.html'), 'utf8', function(err, data) {
        res.writeHead(200, helpers.headers);
        res.end(data);
      });
    } else if (req.url === '/styles.css') {
      fs.readFile(path.join(archive.paths.siteAssets, '/styles.css'), 'utf8', function(err, data) {
        res.writeHead(200, helpers.headers);
        res.end(data);
      });
    // } else if (req.url === '/www.google.com') {
    } else {
      var url = req.url.replace('/', '');
      archive.isUrlArchived(url, function(result) {
        if (result) {
          // its true read the file and serve it up
          fs.readFile(path.join(archive.paths.archivedSites, url), 'utf8', function(err, data) {
            res.writeHead(200, helpers.headers);
            res.end(data);
          });
        } else {
          // check to see if its in the sites.txt list (helper function)
          archive.isUrlInList(url, function(result) {
            if (result) {
              // load loading.html
              fs.readFile(path.join(archive.paths.siteAssets, '/loading.html'), 'utf8', function(err, data) {
                res.writeHead(200, helpers.headers);
                res.end(data);
              });
            } else {
              // serve a 404
              res.writeHead(404, helpers.headers);
              res.end();
            }
          });
        }
      });
    }

  } else if (req.method === 'POST') {
    if (req.url === '/') {
      var data = '';
      req.on('data', function(chunk) {
        data += chunk;
      });
      req.on('end', function() {
        var url = data.replace('url=', '') + '\n';
        // use add url to list instead
        archive.isUrlInList(url, function(result) {
          if (!result) {
            fs.appendFile(archive.paths.list, url, function(error) {
              if (error) {
                throw error;
              } else {
                res.writeHead(302, helpers.head);
                res.end('posted');
              }
            });
          } else {
            archive.isUrlArchived(url, function(result) {
              if (!result) {
                fs.readFile(path.join(archive.paths.siteAssets, '/loading.html'), 'utf8', function(err, data) {
                  res.writeHead(200, helpers.headers);
                  res.end(data);
                });
              } else {
                console.log('-----------ARCHIVED');
                url = url.replace('\n', '');
                console.log(path.join(archive.paths.archivedSites, url));
                fs.readFile(path.join(archive.paths.archivedSites, url), 'utf8', function(err, data) {
                  res.writeHead(200, helpers.headers);
                  res.end(data);
                });
              }
            });
          }
        });
      });
    }
  }
};


// fs.writeFile(archive.paths.list, url, function(error) {
//   if (error) {
//     throw error
//   }
// })

