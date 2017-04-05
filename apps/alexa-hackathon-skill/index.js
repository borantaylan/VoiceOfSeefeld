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
      result = result + "<p>Number " + (i+1) + ": " + listOfHotels[i] + "</p>, ";
    }
    response.say(result.substring(0,result.length-2));
});
app.intent('Information', {
    "slots": {
        "Name": "AMAZON.LITERAL"
    },
    "utterances": [
        "Send me the information about {Sporthotel Xander|Name}",
        "Send me the information about {Pension Krosbacher|Name}",
        "Send me the information about {Haus Tiefenbrunner|Name}",
        "Can you send me information about {Sporthotel Xander|Name}",
        "Can you send me information about {Pension Krosbacher|Name}",
        "Can you send me information about {Haus Tiefenbrunner|Name}"
    ]
}, function(request, response) {
    var param = request.slot("Name");
    response.say("I will send you the information on your phone.");
});

app.intent('Availability', {
    "slots": {
        "Name": "AMAZON.LITERAL"
    },
    "utterances": [
        "Are there available rooms in {Sporthotel Xander|Name}",
        "Are there available rooms in {Pension Krosbacher|Name}",
        "Are there available rooms in {Haus Tiefenbrunner|Name}",
        "Is there a room available {Sporthotel Xander|Name}",
        "Is there a room available {Pension Krosbacher|Name}",
        "Is there a room available {Haus Tiefenbrunner|Name}"
    ]
}, function(request, response) {
    var param = request.slot("Name");
    var listOfRooms = ["Room 1", "Room 2", "Room 3"];
    response.say("There are "+listOfRooms.length+" rooms available.");
});

app.intent('HotelAddress', {
    "slots": {
        "Name": "AMAZON.LITERAL"
    },
    "utterances": [
        "Where is {Sporthotel Xander|Name} located",
        "Where is {Pension Krosbacher|Name} located",
        "Where is {Haus Tiefenbrunner|Name} located",
        "Where is {Sporthotel Xander|Name}",
        "Where is {Pension Krosbacher|Name}",
        "Where is {Haus Tiefenbrunner|Name}",
        "What is the address of {Sporthotel Xander|Name}",
        "What is the address of {Pension Krosbacher|Name}",
        "What is the address of {Haus Tiefenbrunner|Name}"
    ]
}, function(request, response) {
    var param = request.slot("Name");
    var address = "Seefeld Street 1";
    response.say(param+" is located in "+address);
});

app.intent('Booking', {
    "slots": {},
    "utterances": [
        "Book a room for me",
        "Can you book a room for me",
        "Can you do a reservation for me"
    ]
}, function(request, response) {
    response.say("Sorry, i can not do that, but I will send you the number.");
});


module.exports = app;
