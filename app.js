var express = require('express');
var fs      = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app     = express();
var jQuery = require('jquery');

function scrapePage(url) {
    request(url, function(error, response, html){
        if(!error){
            // console.log(url);
            var $ = cheerio.load(html);
            var hyperLinks = $('a');
            // var output = $(hyperLinks[0]).attr('href');
            // $(links).each(function(i, link){
            //     console.log($(link).text() + ':\n  ' + $(link).attr('href'));
            // });
            var q = require('async').queue(function (task, callback) {
                // console.log(task.url);
                if($(hyperLinks[i]).attr('href')){
                    scrapePage($(hyperLinks[i]).attr('href'));
                }
                callback();
            }, 5);


            q.drain = function() {
                console.log('all items have been processed');
            }
            for(var i = 0; i<hyperLinks.length; i++){
                // output += "\n"+$(hyperLinks[i]).attr('href');
                console.log($(hyperLinks[i]).attr('href'));
                q.push({url:$(hyperLinks[i]).attr('href')});
            }

        }


        // for(var i = 0; i < 2000; i++){
        //     q.push({url:"http://somewebsite.com/"+i+"/feed/"});
        // }
        // console.log(output);
        // fs.writeFile('output.csv', output, function(err){
        //     console.log('done');
        // })

        // res.send('Check your console!')
    })
}
app.get('/scrape', function(req, res){
    
    url = 'https://medium.com';

    scrapePage(url);
});

app.listen('8081');
console.log('Magic happens on port 8081');
exports = module.exports = app;