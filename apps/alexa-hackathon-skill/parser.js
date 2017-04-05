//jsonFile = require('./00bcee82-4c69-431a-8a80-6d9e9af44eb8-en');

exports.parseFile = function (filename) {
    var file = require('./' + filename)
    var type = file["@type"]
    if (type.indexOf("Event") >= 1) {
        return parseEvent(file)
    } else if (type.indexOf("BeautySalon") >= 1 || type.indexOf("Store") || type.indexOf("TouristInformationCenter")) {
        return parseInfra(file)
    } else if (type.indexOf("LodgingBusiness") || type.indexOf("Hotel") || type.indexOf("BadAndBreakfast")) {
        return parseAcomodation(file);
    }
}

function parseAcomodation(file) {

    var name = file.name
    var urls = file.url
    var desc = file.description
    var completeDesc = ""
    if ((!!desc) && (desc.constructor === Array)) {
        for (var i = 0; i < desc.length; i++) {
            completeDesc += " "+ desc[i];
        }
    } else {
        completeDesc = desc;
    }

    var addressName = file.address.name
    var street = file.address.streetAddress
    var locality = file.address.addressLocality
    var telephone = file.address.telephone
    var fax = file.address.faxNumber
    var email = file.address.email
    var offers = file.makesOffer
    var offerNames = []
    for (var i = 0; i < offers.length; i++) {
        offerNames.push(offers[i].name)
    }
    //file.makesOffer.description
    var images = file.image

    var img = []
    var caption = []
    for (var i = 0; i < images.length; i++) {
        img.push(images[i].url)
        caption.push(images[i].caption)
    }

    var result = {'name': name, 'urls':urls, 'desc':completeDesc, 'addressName':addressName, 'street':street,
    'locality':locality, 'telephone':telephone, 'fax':fax, 'email':email, 'offerNames':offerNames,
    'images':img, 'caption':caption}

    //console.log(result)
    return result
}

function parseInfra(file) {
    var name = file.name
    var urls = file.url
    var desc = file.description

    var addressName = file.address.name
    var street = file.address.streetAddress
    var locality = file.address.addressLocality
    var telephone = file.address.telephone
    var fax = file.address.faxNumber
    var email = file.address.email
    var addressUrl = file.address.url

    var images = file.image
    var img = []
    var caption = []
    for (var i = 0; i < images.length; i++) {
        img.push(images[i].url)
        caption.push(images[i].caption)
    }

    var result = {'name': name, 'urls':urls, 'desc':desc, 'addressName':addressName, 'street':street,
    'locality':locality, 'telephone':telephone, 'fax':fax, 'email':email, 'addressUrl':addressUrl,
    'images':img, 'caption':caption}

    //console.log(result)
    return result
}

function parseEvent(file) {

    var name = file.name
    var urls = file.url
    var desc = file.description

    var startDate = file.startDate
    var endDate = file.endDate


    //console.log(file);

    var orgName = file.location.name
    var street = file.location.address.streetAddress
    var locality = file.location.address.addressLocality
    var telephone = file.location.address.telephone
    var fax = file.location.address.faxNumber
    var email = file.location.address.email
    var addressUrl = file.location.address.url




    var images = file.image
    var img = []
    var caption = []
    for (var i = 0; i < images.length; i++) {
        img.push(images[i].url)
        caption.push(images[i].caption)
    }

  var result = {'name': name, 'urls':urls, 'desc':desc, 'startDate':startDate, 'endDate':endDate, 'street':street,
    'locality':locality, 'telephone':telephone, 'fax':fax, 'email':email, 'addressUrl':addressUrl,
    'images':img, 'caption':caption}

  //console.log(result)
  return result

}

//parseEvent('0a907e50-f6f8-44ca-a6e1-f653d371d7a1-en')
//console.log(parseAcomodation(require('./00bcee82-4c69-431a-8a80-6d9e9af44eb8-en')))
//parseInfra('0ad00b2f-dee4-41b2-8187-cd84b77f5196-en')

