module.change_code = 1;
'use strict';

var alexa = require('alexa-app');
var app = new alexa.app('hackathon-skill');
var cheerio = require('cheerio');


var moment = require('moment');


app.launch(function(request, response) {
    var hotels = ["Sporthotel Xander","Pension Krosbacher","Haus Tiefenbrunner"];
    request.getSession().set("listOfHotels", hotels);
    response.say('Welcome to Voice of Seefeld!').reprompt('You have any requests?').shouldEndSession(false);

});


app.error = function(exception, request, response) {
    console.log(exception)
    console.log(request);
    console.log(response);
    response.say('Sorry an error occured ' + error.message);
};

app.intent('Locality', {
    "slots": {
        "AddressLocality": "AMAZON.LITERAL"
    },
    "utterances": [
        "Where can I stay in {Seefeld|AddressLocality}",
        "Where can I stay in {Mosern|AddressLocality}",
        "Where can I stay in {Leutasch|AddressLocality}"
    ]
}, function(request, response) {
    var param = request.slot("AddressLocality");
    var session = request.getSession();
    var listOfHotels = session.get("listOfHotels");

    //TODO use param to retrieve hotel lists
    var result = "There are " + listOfHotels.length + " hotels in " + param + " you can stay: " ;

    for(var i=0;i<listOfHotels.length;i++){
      result = result + "Number " + (i+1) + ": " + listOfHotels[i] + ", ";
    }
    response.say(result.substring(0,result.length-1));
});


module.exports = app;
