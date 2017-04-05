var parser = require("./parser.js")

var data = parser.parseFile("filepath for example: data/00bcee82-4c69-431a-8a80-6d9e9af44eb8-en")

var name = data['name']
var desc = data['desc']
etc.


viable fields for an accomandation-object:
name
urls
desc
addressName
street
locality
telephone
fax
email
offerNames
images
caption

viable fields for an infrastructure-object:
name
urls
desc
addressName
street
locality
telephone
fax
email
addressUrl
images
caption

viable fields for an event-object:
name
urls
desc
startDate
endDate
street
locality
telephone
fax
email
addressUrl
images
caption