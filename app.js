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
        for(var i=0; i<5;i++){
            console.log($(hyperLinks[i]).attr('href'));
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

app.listen('8081');
exports = module.exports = app;