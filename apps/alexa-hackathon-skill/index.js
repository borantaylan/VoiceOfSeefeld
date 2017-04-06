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
    var filteredEventJSONs = [];
    var listOfEvents = [];
    listOfEventJSONs.forEach(event => {
        if(event['locality']===param){
            listOfEvents.push(event['name']);
            filteredEventJSONs.push(event);
        }
    });

    //TODO use param to retrieve hotel lists
    var result = "There are " + listOfEvents.length + " events in " + param + ": ";
    var numberedArrays = [];

    for (var i = 0; i < listOfEvents.length; i++) {
        result = result + "<p>Number " + (i + 1) + ": " + listOfEvents[i] + "</p>, ";
        numberedArrays.push(filteredEventJSONs[i]);
    }
    request.getSession().set("numberedArrays", numberedArrays);
    request.getSession().set("state", "event");
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

app.intent("numberDialog",{
    "slots": {"inputNum": "AMAZON.LITERAL"},
    "utterances": [
        "Send me the information about {Number One|inputNum}",
        "Send me the information about {Number Two|inputNum}",
        "Send me the information about {Number Three|inputNum}"
    ]
}, function(request, response) {
  var param = request.slot("inputNum");
  var numberedArrays = request.getSession().get("numberedArrays");
  if(numberedArrays.length>0){
    if(param==="Number One"){
        response.say("I am sending the information about "+numberedArrays[1]['name']+" on your phone.");
        var additionalDesc = ""
        if (request.getSession().get("state")==="event") {
            additionalDesc = "\n It starts at " + numberedArrays[0]['startDate']+ "\n It ends at "+numberedArrays[0]['endDate']
        }
        response.card({
            type: "Standard",
            title: "Informations about "+numberedArrays[0]['name'], // this is not required for type Simple or Standard
            text: "Description: "+numberedArrays[0]['desc']+additionalDesc+
            "\n Address: "+numberedArrays[0]['street']+
            ", "+numberedArrays[0]['locality']+
            "\n Telephone: "+numberedArrays[0]['telephone']
            +"\n Email: "+numberedArrays[0]['email'],
            image: { // image is optional
                smallImageUrl: numberedArrays[0]['images'][0], // required
                largeImageUrl: numberedArrays[0]['images'][0]
            }
        });
    }
    if(param==="Number Two"){
        response.say("I am sending the information about "+numberedArrays[1]['name']+" on your phone.");
        var additionalDesc = ""
        if (request.getSession().get("state")==="event") {
            additionalDesc = "\n It starts at " + numberedArrays[1]['startDate']+ "\n It ends at "+numberedArrays[1]['endDate']
        }
        response.card({
            type: "Standard",
            title: "Informations about "+numberedArrays[1]['name'], // this is not required for type Simple or Standard
            text: "Description: "+numberedArrays[1]['desc']+additionalDesc+
            "\n Address: "+numberedArrays[1]['street']+
            ", "+numberedArrays[1]['locality']+"\n Telephone: "+
            numberedArrays[1]['telephone']+
            "\n Email: "+numberedArrays[1]['email'],
            image: { // image is optional
                smallImageUrl: numberedArrays[1]['images'][0], // required
                largeImageUrl: numberedArrays[1]['images'][0]
            }
        });
    }
    if(param==="Number Three"){
        response.say("I am sending the information about "+numberedArrays[2]['name']+" on your phone.");
        if (request.getSession().get("state")==="event") {
            additionalDesc = "\n It starts at " + numberedArrays[2]['startDate']+ "\n It ends at "+numberedArrays[2]['endDate']
        }
        response.card({
            type: "Standard",
            title: "Informations about "+numberedArrays[2]['name'], // this is not required for type Simple or Standard
            text: "Description: "+numberedArrays[2]['desc']+additionalDesc+
            "\n Address: "+numberedArrays[2]['street']+", "+
            numberedArrays[2]['locality']+"\n Telephone: "+
            numberedArrays[2]['telephone']+"\n Email: "+
            numberedArrays[2]['email'],
            image: { // image is optional
                smallImageUrl: numberedArrays[2]['images'][0], // required
                largeImageUrl: numberedArrays[2]['images'][0]
            }
        });
    }
  }
  else response.say("You're now on vacation.");
});

app.intent('Salut', {
    "slots": {
        "Place": "AMAZON.LITERAL"
    },
    "utterances": [
        "I want to travel to {Seefeld|Place} soon",
        "I want to travel to {Leutasch|Place} soon",
        "I want to travel to {Scharnitz|Place} soon",
        "Is {Seefeld|Place} a good place to visit",
        "Is {Leutasch|Place} a good place to visit",
        "Is {Scharnitz|Place} a good place to visit"
    ]
}, function(request, response) {
    var param = request.slot("Place");
    response.say("<p>Oh Cool!</p> Should I send you some pictures for "+param+"?");
    request.getSession().set("decision",true);
    request.getSession().set("place",param);
});

app.intent('AnswerYes', {
    "slots": {},
    "utterances": [
        "Yes, please",
        "Yes"
    ]
}, function(request, response) {
    if(request.getSession().get("decision") === true){
        var param = request.getSession().get("place");
        response.say("Ok i am sending a picture to your phone.");
        var links = {
                "Seefeld":{
                    "smallurl" : "https://views.austria.info/uploads/image/file/3861/thumb_xlarge_d1c682be-fd58-4cef-b53b-798b300c8479.jpg",
                    "bigurl" : "https://views.austria.info/uploads/image/file/3861/thumb_preview_d1c682be-fd58-4cef-b53b-798b300c8479.jpg"
                },
                "Leutasch":{
                    "smallurl" : "https://views.austria.info/uploads/image/file/1684/thumb_xlarge_3639f858-3d72-4654-98ef-556958d42e1e.jpg",
                    "bigurl" : "https://views.austria.info/uploads/image/file/1684/thumb_preview_3639f858-3d72-4654-98ef-556958d42e1e.jpg"
                },
                "Scharnitz":{
                    "smallurl" : "https://views.austria.info/uploads/image/file/2858/thumb_xlarge_d82cf894-b1f1-461e-bf70-3e36d516082b.jpg",
                    "bigurl" : "https://views.austria.info/uploads/image/file/2858/thumb_preview_d82cf894-b1f1-461e-bf70-3e36d516082b.jpg"
                }
        }
        response.card({
            type: "Standard",
            title: "Picture of "+param, // this is not required for type Simple or Standard
            text: "More pictures on: https://views.austria.info/en/media?q="+param,
            image: { // image is optional
                smallImageUrl: links[param]['smallurl'], // required
                largeImageUrl: links[param]['bigurl']
            }
        });
        request.getSession().clear("decision");
    }
}
);

app.intent('AnswerNo', {
    "slots": {},
    "utterances": [
        "No",
        "No thanks"
    ]
}, function(request, response) {
    if(request.getSession().get('decision')===true){
        response.say("I am sending you anyway, if you want to take a look");
        var param = request.getSession().get("place");
        var links = {
                "Seefeld":{
                    "smallurl" : "https://views.austria.info/uploads/image/file/3861/thumb_xlarge_d1c682be-fd58-4cef-b53b-798b300c8479.jpg",
                    "bigurl" : "https://views.austria.info/uploads/image/file/3861/thumb_preview_d1c682be-fd58-4cef-b53b-798b300c8479.jpg"
                },
                "Leutasch":{
                    "smallurl" : "https://views.austria.info/uploads/image/file/1684/thumb_xlarge_3639f858-3d72-4654-98ef-556958d42e1e.jpg",
                    "bigurl" : "https://views.austria.info/uploads/image/file/1684/thumb_preview_3639f858-3d72-4654-98ef-556958d42e1e.jpg"
                },
                "Scharnitz":{
                    "smallurl" : "https://views.austria.info/uploads/image/file/2858/thumb_xlarge_d82cf894-b1f1-461e-bf70-3e36d516082b.jpg",
                    "bigurl" : "https://views.austria.info/uploads/image/file/2858/thumb_preview_d82cf894-b1f1-461e-bf70-3e36d516082b.jpg"
                }
        }
        response.card({
            type: "Standard",
            title: "Picture of "+param, // this is not required for type Simple or Standard
            text: "More pictures on: https://views.austria.info/en/media?q="+param,
            image: { // image is optional
                smallImageUrl: links[param]['smallurl'], // required
                largeImageUrl: links[param]['bigurl']
            }
        });
        request.getSession().clear("decision");
    }
});

module.exports = app;

