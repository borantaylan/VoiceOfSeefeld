//jsonFile = require('./00bcee82-4c69-431a-8a80-6d9e9af44eb8-en');


exports.parseFile = function (param) {

    var results = []

    if (param == "LodgingBusiness") {
        var files = ["./data/LodgingBusiness/00bcee82-4c69-431a-8a80-6d9e9af44eb8-en.json", "./data/LodgingBusiness/0a094ae7-145e-469f-a864-ea54616c2a55-en.json", "./data/LodgingBusiness/0a92211d-d0db-4875-a26e-a5cdd0c6b434-en.json",
        "./data/LodgingBusiness/0a2afaa0-7906-4732-866e-689feed903a6-en.json", "./data/LodgingBusiness/0ac88389-88c6-4c6d-942d-f548f3a3c022-en.json"]
    } else if (param == "Event") {
        var files = ["./data/Event/0a907e50-f6f8-44ca-a6e1-f653d371d7a1-en.json", "./data/Event/0d5d5a43-6243-4a89-8fa1-d766d87cb263-en.json", "./data/Event/94aab131-a30a-49c2-9580-4f4f142f26ac-en.json",
        "./data/Event/0d6ed06e-2245-466d-aadd-61fa292e10fb-en.json"]
    } else if (param == "Infrastructure") {
        var files = ["./data/infrastructure/0b6d7063-fe7a-412c-9f00-6816876ad6e9-en.json", "./data/infrastructure/1b3b6167-5533-44d7-b7b9-0505967c6e95-en.json", "./data/infrastructure/f32e37f8-be1e-4164-8d60-bef4a110a99e-en.json",
        "./data/infrastructure/0ad00b2f-dee4-41b2-8187-cd84b77f5196-en.json", "./data/infrastructure/0b3c3418-8634-49e5-974b-646ca2c393f2-en.json"]
    }

    for (var i = 0; i < files.length; i++) {
        results.push(startParsing(files[i]))
    }

    return results
}

function startParsing(filename) {
    var file = require(filename)
    var type = file["@type"]
    //console.log(type)
    if (type.indexOf("Event") >= 0) {
        return parseEvent(file)
    } else if (type.indexOf("BeautySalon") >= 0 || type.indexOf("Store") >= 0 || type.indexOf("TouristInformationCenter") >= 0) {
        return parseInfra(file)
    } else if (type.indexOf("LodgingBusiness") >= 0|| type.indexOf("Hotel") >= 0 || type.indexOf("BadAndBreakfast") >= 0) {
        return parseAcomodation(file);
    }

}

function parseAcomodation(file) {

    var name = file.name.toLowerCase();
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

