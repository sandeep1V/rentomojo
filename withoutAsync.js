var request = require('request');
var cheerio = require('cheerio');
function scrapePage(arg, callback) {
    request(arg, function(err, response, body){
        if(body){
            var $ = cheerio.load(body);
            var hyperLinks = $('a');
            for(var i=0; i<hyperLinks.length;i++){
                console.log(items);
                if($(hyperLinks[i]).attr('href')){
                    items.push($(hyperLinks[i]).attr('href'));
                }
            }
            setTimeout(function() {
                launcher();
                callback(null);
            }, 1000);
        }
    });
    // console.log('do something with \''+arg+'\', return 1 sec later');
}
function final() { console.log('Done', results); }

var items = [ 'https://medium.com'];
var results = [];
var running = 0;
var limit = 1;

function launcher() {
    while(running < limit && items.length > 0) {
        var item = items.shift();
        scrapePage(item, function(result) {
            results.push(item);
            running--;
            if(items.length > 0) {
                launcher();
            } else if(running == 0) {
                final();
            }
        });
        running++;
    }
}

launcher();