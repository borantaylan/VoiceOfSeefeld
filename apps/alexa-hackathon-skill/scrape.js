var cheerio = require('cheerio');
var request1 = require('request');
var moment = require('moment');

request1('http://menu.mensen.at/index/index/locid/55', function(error, response1, html) {
    if (!error && response1.statusCode == 200) {
        date='2017-03-30';
        var $ = cheerio.load(html);
        var output = "Tut mir leid, Keine Ahnung";
        $('.day').each(function() {
            var paramdate = moment($(this).find('.date').html(),"DD.MM.YYYY").format("YYYY-MM-DD")
            if(paramdate==date){
              output="";
              $(this).find('.category').each(function() {
                  if ($(this).find('.category-content > p').length) {
                        output = output + $(this).find('.category-title').html()+ ":";
                      $(this).find('.category-content > p').each(function() {
                        output = output + " " + $(this).html().replace(/ *\([^)]*\) */g, "") ;
                      })
                  }
                  output += ". ";
              })
              return false;
            }
        });
        console.log(output);
    } else {
        console.log(output);
    }
});
