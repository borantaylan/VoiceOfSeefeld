module.change_code = 1;
'use strict';

var alexa = require('alexa-app');
var app = new alexa.app('hackathon-skill');
var cheerio = require('cheerio');
var filesystemIO = require('fs');

var moment = require('moment');
var parser = require("./parser.js");



app.launch(function(request, response) {
  var logBusDir = "./data/";
  filesystemIO.readdir(logBusDir, (fileerror, filenames) => {
      filenames.forEach(filename => {
        console.log(logBusDir+filename);

        //var tempJSON = parser.parseFile(logBusDir+file);
        //listOfHotelJSONs.push(tempJSON);
      });
  });
  var listOfHotelJSONs = [];

    request.getSession().set("listOfHotels", listOfHotelJSONs);
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
        listOfHotels.push(hotel['name']);
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
    response.say("I will send you the information on your phone.");
    response.card({
        type: "Standard",
        title: "Informations about Sporthotel Xander", // this is not required for type Simple or Standard 
        text: "Description: In the heart of Leutasch the family run **** Hotel Xander, the oldest inn in the valley, is tucked away next to the onion-domed village-church. 150 beds in 12 double-rooms and 55 apartments with lounge area, bath/shower/WC. Telephone, safe, radio, SAT-TV and kitchenette\n dog per day 11,00 €\ngarage 10,00 € per day\nsauna, swiming pool is free\njacuzzi + solarium 7,00 €\nlaundry service 8,00 €\nlocal tax excl. \nlocationplan: the Hotel is in front of the church at the district Kirchplatzl.\nCheck in 14.00  Check out 10.00\nAddress: Kirchplatzl 147 in Leutasch\nTelephone: +4352146581\nWebsite: http://www.xander-leutasch.at",
        image: { // image is optional 
            smallImageUrl: "http://resc.deskline.net/images/SEE/1/537c5c99-31af-45dc-943a-9a7fefe315ba/99/image.jpg", // required 
            largeImageUrl: "http://resc.deskline.net/images/SEE/1/6ceb14dd-8f3f-4949-9bb9-947c98bc8350/99/image.jpg"
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
    var listOfRooms = ["Room 1", "Room 2", "Room 3"];
    response.say("There are " + listOfRooms.length + " rooms available.");
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
    response.say(param + " is located in " + address);
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
