app.intent('Salut', {

    "slots": {

        "LastWord": "AMAZON.LITERAL"

    },

    "utterances": [

        "How you doing {idiot|LastWord}",

        "How you doing {stupid|LastWord}",

    ]

}, function(request, response) {

    var param = request.slot("LastWord");

    response.say("How dare you call me " + param);

});