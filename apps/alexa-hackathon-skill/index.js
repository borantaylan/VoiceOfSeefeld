module.change_code = 1;
'use strict';

var alexa = require('alexa-app');
var app = new alexa.app('hackathon-skill');
var cheerio = require('cheerio');

var moment = require('moment');
var parser = require("./parser.js");

var listOfHotelJSONs;

app.launch(function(request, response) {

    //var listOfHotelJSONs = parser.parseFile("LodgingBusiness");
    //request.getSession().set("listOfHotels", listOfHotelJSONs);
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
    listOfHotelJSONs = [{
      "locality" : "Seefeld",
      "name" : "lol"
    },{
      "locality" : "Seefeld",
      "name" : "haha"
    }];
    var param = request.slot("AddressLocality");
    //var listOfHotelJSONs = request.getSession().get("listOfHotels");
    var filteredHotelJSONs = [];
    var listOfHotels = [];
    listOfHotelJSONs.forEach(hotel => {
        if(hotel['locality']===param){
            console.log("if")
            listOfHotels.push(hotel['name']);
            filteredHotelJSONs.push(hotel);
        }
    });


    var result = "There are " + listOfHotels.length + " hotels in " + param + " you can stay: ";
    var numberedArrays = [];
    for (var i = 0; i < listOfHotels.length; i++) {
        //var temp = {};
        //temp[i + 1] = filteredHotelJSONs[i];
        numberedArrays.push(filteredHotelJSONs[i]);
        result = result + "<p>Number " + (i + 1) + ": " + listOfHotels[i] + "</p>, ";
    }
    request.getSession().set("numberedArrays", numberedArrays);
    request.getSession().set("state", "hotel");
    response.say(result.substring(0, result.length - 2));
});
module.exports = app;
