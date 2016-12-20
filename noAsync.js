var https = require('https');
var cheerio = require('cheerio');
var totalUrl = 10;
var currentUrl = 0;
var resultUrl = ['https://medium.com'];
var totalLoop = 5;
    setConcurrentRequests(resultUrl[0]);
    // getNextUrl(resultUrl[0]);
function setConcurrentRequests(url) {
    var concurrentLimit = 5;
    getNextUrl(url);
    function getNextUrl(){
        if(concurrentLimit == 0){
            getNextUrl(url);
            return
        }
        concurrentLimit--;

        if(currentUrl >= totalUrl){
            console.log("nothing else to do for this worker");
            return;
        }

        https.get(url, function(res) {
            var pageData = "";
            res.resume();
            res.on('data', function (chunk) {
                if(res.statusCode == 200){
                    pageData +=chunk;
                }
            });
            res.on('end', function() {
                concurrentLimit++;
                // do something with the HTML page
                var $ = cheerio.load(pageData);
                var hyperLinks = $('a');
                for(var i=0; i<hyperLinks.length;i++){
                    resultUrl.push($(hyperLinks[i]).attr('href'));
                    console.log(resultUrl);
                    getNextUrl($(hyperLinks[i]).attr('href'));
                }
                // getNextUrl(); //call the next url to fetch
            });

        }).on('error', function(e) {
            getNextUrl();
        });
    };
}