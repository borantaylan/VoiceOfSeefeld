module.change_code = 1;
'use strict';

var alexa = require('alexa-app');
var app = new alexa.app('hackathon-skill');
var cheerio = require('cheerio');

var moment = require('moment');
var parser = require("./parser.js");



app.launch(function(request, response) {

    var listOfHotelJSONs = parser.parseFile("LodgingBusiness");
    var listOfEventJSONs = parser.parseFile("Event");
    var listOfInfrastructureJSONs = parser.parseFile("Infrastructure");

    request.getSession().set("listOfHotels", listOfHotelJSONs);
    request.getSession().set("listOfEvents", listOfEventJSONs);
    request.getSession().set("listOfInfrastructureJSONs", listOfInfrastructureJSONs);
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
    var listOfHotelJSONs = request.getSession().get("listOfHotels");
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
    var listOfHotelJSONs = request.getSession().get("listOfHotels");
    var listOfHotels = [];
    listOfHotelJSONs.forEach(hotel => {
        if(hotel['name']===param){
            listOfHotels.push(hotel['desc']);
            listOfHotels.push(hotel['street']);
            listOfHotels.push(hotel['locality']);
            listOfHotels.push(hotel['telephone']);
            listOfHotels.push(hotel['email']);
            listOfHotels.push(hotel['images']);
        }
    });
    response.say("I will send you the information about "+param+" on your phone.");
    response.card({
        type: "Standard",
        title: "Informations about "+param, // this is not required for type Simple or Standard
        text: "Description: "+listOfHotels[0]+"\nAddress: "+listOfHotels[1]+", "+listOfHotels[2]+"\nTelephone: "+listOfHotels[3]+"\nEmail: "+listOfHotels[4],
        image: { // image is optional
            smallImageUrl: listOfHotels[5][0], // required
            largeImageUrl: listOfHotels[5][0]
        }
    });
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
    var listOfHotelJSONs = request.getSession().get("listOfHotels");
    var listOfHotels = [];
    listOfHotelJSONs.forEach(hotel => {
        if(hotel['name']===param){
            listOfHotels.push(hotel['offerNames'].length);
        }
    });
    response.say("There are " + listOfHotels[0] + " rooms available.");
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
    var listOfHotelJSONs = request.getSession().get("listOfHotels");
    var listOfHotels = [];
    listOfHotelJSONs.forEach(hotel => {
        if(hotel['name']===param){
            listOfHotels.push(hotel['street']);
            listOfHotels.push(hotel['locality']);
        }
    });
    response.say(param + " is located in " + listOfHotels[0] + ", "+listOfHotels[1]);
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
    response.card({
        type: "Simple",
        content: "Telephone number of the hotel: +436504753001"
    });
});

module.exports = app;
