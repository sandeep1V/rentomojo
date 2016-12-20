var express = require('express');
var fs      = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app     = express();
var async = require('async');
var resultUrls = [];


var queue = async.queue(function scrapePage(url, next) {
    if (!url || resultUrls.indexOf(url) !== -1) return next(null);
    request(url, function(err, response, body){
        if (err) return next(err);
        resultUrls.push(url);
        var $ = cheerio.load(body);
        var hyperLinks = $('a');
        for(var i=0; i<hyperLinks.length;i++){
            queue.push($(hyperLinks[i]).attr('href'));
        }
        next(null);
    });
}, 5);

app.get('/scrape', function(req, res){
    queue.push('https://medium.com');
    queue.drain = function () {
        //called at the end
        var output = resultUrls[0];
        for(var i=1; i<resultUrls.length;i++){
            output += "\n"+resultUrls[i]
        }
        fs.writeFile('output.csv',output, function (err, resp) {
            console.log('done');
        })
    }
});

var Crawler = require("crawler");
var url = require('url');

var c = new Crawler({
    maxConnections : 5,
    // This will be called for each crawled page
    callback : function (error, res, done) {
        if(error){
            console.log(error);
        }else{
            var $ = res.$;
            // $ is Cheerio by default
            //a lean implementation of core jQuery designed specifically for the server

            var hyperLinks = $('a');
            for(var i=0; i<5;i++){
                console.log($(hyperLinks[i]).attr('href'));
                c.queue($(hyperLinks[i]).attr('href'));
            }
        }
        done();
    }
});

// Queue just one URL, with default callback
c.queue('https://medium.com');

c.on('drain', function () {
    console.log('done') ;
});
// Queue a list of URLs
// c.queue(['http://www.google.com/','http://www.yahoo.com']);

// Queue URLs with custom callbacks & parameters
// c.queue([{
//     uri: 'http://parishackers.org/',
//     jQuery: false,
//
//     // The global callback won't be called
//     callback: function (error, res, done) {
//         if(error){
//             console.log(error);
//         }else{
//             console.log('Grabbed', res.body.length, 'bytes');
//         }
//         done();
//     }
// }]);

// Queue some HTML code directly without grabbing (mostly for tests)

app.listen('8081');
exports = module.exports = app;