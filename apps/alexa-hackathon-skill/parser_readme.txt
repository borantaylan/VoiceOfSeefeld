var parser = require('./parser')

var data;
parser.parseFile('./data/LodgingBusiness/', function(result) {
    data = result.length;
})

var name = data['name']
var desc = data['desc']
etc.


viable fields for an accomandation-object:
name
urls -> []
desc
addressName
street
locality
telephone
fax
email
offerNames -> []
images -> []
caption -> []

viable fields for an infrastructure-object:
name
urls -> []
desc
addressName
street
locality
telephone
fax
email
addressUrl
images -> []
caption -> []

viable fields for an event-object:
name
urls -> [] carefull, its not in every file available
desc
startDate
endDate
street
locality
telephone
fax
email
addressUrl
images -> []
caption -> []