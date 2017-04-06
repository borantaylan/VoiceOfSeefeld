module.change_code = 1;
'use strict';

var alexa = require('alexa-app');
var app = new alexa.app('hackathon-skill');
var cheerio = require('cheerio');

var moment = require('moment');
var parser = require("./parser.js");



app.launch(function(request, response) {

    var listOfHotelJSONs = [];
    listOfHotelJSONs = parser.parseFile("LodgingBusiness");
    console.log(listOfHotelJSONs);
    request.getSession().set("listOfHotels", listOfHotelJSONs);
    var listOfEventJSONs = [];
    listOfEventJSONs = parser.parseFile("Event");
    console.log(listOfEventJSONs);
    request.getSession().set("listOfEvents", listOfEventJSONs);
    console.log(listOfHotelJSONs);
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
    var listOfHotels = [];
    listOfHotelJSONs.forEach(hotel => {
        if(hotel['locality']===param){
            listOfHotels.push(hotel['name']);
        }
    });

    //TODO use param to retrieve hotel lists
    var result = "There are " + listOfHotels.length + " hotels in " + param + " you can stay: ";

    for (var i = 0; i < listOfHotels.length; i++) {
        result = result + "<p>Number " + (i + 1) + ": " + listOfHotels[i] + "</p>, ";
    }
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

app.intent('EventLocality', {
    "slots": {
        "Locality": "AMAZON.LITERAL"
    },
    "utterances": [
        "What events are in {Seefeld|Locality}",
        "What events are in {Scharnitz|Locality}"
    ]
}, function(request, response) {
    var param = request.slot("Locality");
    var listOfEventJSONs = request.getSession().get("listOfEvents");
    var listOfEvents = [];
    listOfEventJSONs.forEach(event => {
        if(event['locality']===param){
            listOfEvents.push(event['name']);
        }
    });

    //TODO use param to retrieve hotel lists
    var result = "There are " + listOfEvents.length + " events in " + param + ": ";

    for (var i = 0; i < listOfEvents.length; i++) {
        result = result + "<p>Number " + (i + 1) + ": " + listOfEvents[i] + "</p>, ";
    }
    response.say(result.substring(0, result.length - 2));

});

app.intent('EventInformation', {
    "slots": {
        "Name": "AMAZON.LITERAL"
    },
    "utterances": [
        "Send me the information about {Piano music (live)|Name}",
        "Send me the information about {Village Festival of Seefeld´s associations|Name}",
        "Send me the information about {Winter Activities - Enchanting Snowshoe hike|Name}",
        "Send me the information about {Concert of French choir Le Diairi|Name}",
        "Can you send me information about {Piano music (live)|Name}",
        "Can you send me information about {Village Festival of Seefeld´s associations|Name}",
        "Can you send me information about {Winter Activities - Enchanting Snowshoe hike|Name}",
        "Can you send me information about {Concert of French choir Le Diairi|Name}"
    ]
}, function(request, response) {
    var param = request.slot("Name");
    var listOfEventJSONs = request.getSession().get("listOfEvents");
    var listOfEvent = [];
    listOfEventJSONs.forEach(event => {
        if(event['name']===param){
            listOfEvent.push(event['desc']);
            listOfEvent.push(event['startDate']);
            listOfEvent.push(event['endDate']);
            listOfEvent.push(event['street']);
            listOfEvent.push(event['locality']);
            listOfEvent.push(event['telephone']);
            listOfEvent.push(event['email']);
            listOfEvent.push(event['addressUrl']);
            listOfEvent.push(event['images']);
        }
    });
    if(listOfEvent.length > 0){
        response.say("I will send you the information about " + param + " on your phone.");
        response.card({
            type: "Standard",
            title: "Informations about "+param, // this is not required for type Simple or Standard
            text: "Description: "+listOfEvent[0]+"\nStart: "+listOfEvent[1]+"\n Ende: "+listOfEvent[2]+"\nAddress: "+listOfEvent[3]+" "+listOfEvent[4]+"\n Telephone: "+listOfEvent[5]+"\n Email: "+listOfEvent[6]+"\n Website: "+listOfEvent[7],
            image: { // image is optional
                smallImageUrl: listOfEvent[8][0], // required
                largeImageUrl: listOfEvent[8][0]
            }
        });
    }else{
        response.say("Unfortunately, there are no details for this event.")
    }
});

app.intent('StartEvent', {
    "slots": {
        "Name": "AMAZON.LITERAL"
    },
    "utterances": [
        "When is {Piano music (live)|Name}",
        "When is {Village Festival of Seefeld´s associations|Name}",
        "When is {Winter Activities - Enchanting Snowshoe hike|Name}",
        "When is {Concert of French choir \"Le Diairi\"|Name}",
        "When does {Piano music (live)|Name} start",
        "When does {Village Festival of Seefeld´s associations|Name} start",
        "When does {Winter Activities - Enchanting Snowshoe hike|Name} start",
        "When does {Concert of French choir \"Le Diairi\"|Name} start"
    ]
}, function(request, response) {
    var param = request.slot("Name");
    var listOfEventJSONs = request.getSession().get("listOfEvents");
    var listOfEvent = [];
    listOfEventJSONs.forEach(event => {
        if(event['name']===param){
            listOfEvent.push(event['startDate']);
        }
    });
    if(listOfEvent.length > 0){
        response.say(param + " starts " + listOfEvent[0]);
    }else{
        response.say("Unfortunately, there is no start date available for this event.")
    }
});

app.intent('EndEvent', {
    "slots": {
        "Name": "AMAZON.LITERAL"
    },
    "utterances": [
        "When is {Piano music (live)|Name} finished",
        "When is {Village Festival of Seefeld´s associations|Name} finished",
        "When is {Winter Activities - Enchanting Snowshoe hike|Name} finished",
        "When is {Concert of French choir \"Le Diairi\"|Name} finished",
        "When does {Piano music (live)|Name} end",
        "When does {Village Festival of Seefeld´s associations|Name} end",
        "When does {Winter Activities - Enchanting Snowshoe hike|Name} end",
        "When does {Concert of French choir \"Le Diairi\"|Name} end"
    ]
}, function(request, response) {
    var param = request.slot("Name");
    var listOfEventJSONs = request.getSession().get("listOfEvents");
    var listOfEvent = [];
    listOfEventJSONs.forEach(event => {
        if(event['name']===param){
            listOfEvent.push(event['endDate']);
        }
    });
    if(listOfEvent.length > 0){
        response.say(param + " ends " + listOfEvent[0]);
    }else{
        response.say("Unfortunately, there is no end date available for this event.")
    }
});

app.intent('EventLocation', {
    "slots": {
        "Name": "AMAZON.LITERAL"
    },
    "utterances": [
        "Where is {Piano music (live)|Name} located",
        "Where is {Village Festival of Seefeld´s associations|Name} located",
        "Where is {Winter Activities - Enchanting Snowshoe hike|Name} located",
        "Where is {Concert of French choir \"Le Diairi\"|Name} located",
        "Where is {Piano music (live)|Name}",
        "Where is {Village Festival of Seefeld´s associations|Name}",
        "Where is {Winter Activities - Enchanting Snowshoe hike|Name}",
        "Where is {Concert of French choir \"Le Diairi\"|Name}",
        "What is the address of {Piano music (live)|Name}",
        "What is the address of {Village Festival of Seefeld´s associations|Name}",
        "What is the address of {Winter Activities - Enchanting Snowshoe hike|Name}",
        "What is the address of {Concert of French choir \"Le Diairi\"|Name}"
    ]
}, function(request, response) {
    var param = request.slot("Name");
    var listOfEventJSONs = request.getSession().get("listOfEvents");
    var listOfEvent = [];
    listOfEventJSONs.forEach(event => {
        if(event['name']===param){
            listOfEvent.push(event['street']);
            listOfEvent.push(event['locality']);
        }
    });
    if(listOfEvent.length > 0){
        response.say(param + " is located in " + listOfEvent[1] + " in " + listOfEvent[0]);
    }else{
        response.say("Unfortunately, there is location data available for this event.")
    }
});

app.intent('EventContact', {
    "slots": {
        "Name": "AMAZON.LITERAL"
    },
    "utterances": [
        "Tell me the contact of {Piano music (live)|Name}",
        "Tell me the contact of {Village Festival of Seefeld´s associations|Name}",
        "Tell me the contact of {Winter Activities - Enchanting Snowshoe hike|Name}",
        "Tell me the contact of {Concert of French choir \"Le Diairi\"|Name}"
    ]
}, function(request, response) {
    var param = request.slot("Name");
    var listOfEventJSONs = request.getSession().get("listOfEvents");
    var listOfEvent = [];
    listOfEventJSONs.forEach(event => {
        if(event['name']===param){
            listOfEvent.push(event['telephone']);
        }
    });
    if(listOfEvent.length > 0){
        response.say("I will send you the telephone number on your phone");
            response.card({
        type: "Simple",
        content: "Telephone number of the hotel: "+listOfEvent[0]
    });
    }else{
        response.say("Unfortunately, there is telephone number available for this event.")
    }
});

app.intent('EventPhoto', {
    "slots": {
        "Name": "AMAZON.LITERAL"
    },
    "utterances": [
        "Send me a image of {Piano music (live)|Name}",
        "Send me a image of {Village Festival of Seefeld´s associations|Name}",
        "Send me a image of {Winter Activities - Enchanting Snowshoe hike|Name}",
        "Send me a image of {Concert of French choir \"Le Diairi\"|Name}"
    ]
}, function(request, response) {
    var param = request.slot("Name");
    var listOfEventJSONs = request.getSession().get("listOfEvents");
    var listOfEvent = [];
    listOfEventJSONs.forEach(event => {
        if(event['name']===param){
            listOfEvent.push(event['images']);
        }
    });
    if(listOfEvent.length > 0){
        if(listOfEvent[0]){
        response.say("I will send you the photos on your phone");
        response.card({
            type: "Standard",
            title: "Photos from "+param, // this is not required for type Simple or Standard
            text: " ",
            image: { // image is optional
                smallImageUrl: listOfEvent[0][0], // required
                largeImageUrl: listOfEvent[0][0]
            }
        });
        }
    }else{
        response.say("Unfortunately, there are no photos available for this event.")
    }
});

module.exports = app;
