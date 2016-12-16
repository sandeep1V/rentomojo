var express = require('express');
var fs      = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app     = express();

function scrapePage(url) {
    request(url, function(error, response, html){
        if(!error){
            // console.log(url);
            var $ = cheerio.load(html);
            var hyperLinks = $('a');
            var q = require('async').queue(function (task, callback) {
                console.log(task.url);
                if(task.url){
                    scrapePage(task.url);
                }
                callback();
            }, 5);


            q.drain = function() {
                console.log('all items have been processed');
            }
            for(var i = 0; i<hyperLinks.length; i++){
                // output += "\n"+$(hyperLinks[i]).attr('href');
                q.push({url:$(hyperLinks[i]).attr('href')});
            }

        }
    })
}
app.get('/scrape', function(req, res){
    url = 'https://medium.com';
    scrapePage(url);
});

app.listen('8081');
exports = module.exports = app;