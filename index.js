const express = require("express");
const path = require("path");
const fs = require("fs");
const ssha512 = require('salted-sha512');
const csv = require('jquery-csv/src/jquery.csv.js');
var datatoread = './datatoread.csv';
var db = require("./database.js");
const PORT = process.env.PORT || 5000


const app = express();

const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.urlencoded());

var TestValue = "Hey!! Why are you accessing";
//const jsonString02 = '{ "commands" :[ { "type" : "com.okta.assertion.patch", "value" : [ { "op": "add", "path": "/claims/newAssertionAttribute" , "value" : { "attributes" : { "NameFormat" : "urn:oasis:names:tc:SAML:2.0:attrname-format:basic" }, "attributeValues" : [ { "attributes" : { "xsi:type" : "xs:string" }, "value" : "TestValue" } ] } } ] } ] }';
//var jsonString01 = '{ "commands" :[ { "type" : "com.okta.assertion.patch", "value" : [ { "op": "add", "path": "/claims/SAML Inline Hook Values - Fetched from DB" , "value" : { "attributes" : { "NameFormat" : "urn:oasis:names:tc:SAML:2.0:attrname-format:basic" }, "attributeValues" : [ { "attributes" : { "xsi:type" : "xs:string" }, "value" : "' + TestValue + '" } ] } } ] } ] }';


app.listen(PORT, () => console.log(`Listening on ${ PORT }`));
app.get('/', function (req, res){ res.sendFile(path.join(__dirname + '/toShow.html'));});
app.post('/hook', function(req, res){

    try {

        issuerId = req.body.data.context.protocol.issuer['uri'];
        userName = req.body.data.context.user.profile['login'];

        if(issuerId === "http://www.okta.com/exk4xwhkchA4xQZZ94x7"){
            fs.readFile(datatoread, 'UTF-8', function (err, filecontent) {
                csv.toArrays(filecontent, {}, function (err, data) {
                    for (var i = 0, len = data.length; i < len; i++) {
                        if(data[i][0] === userName){
                            return res.status(201).send('{ "commands" :[ { "type" : "com.okta.assertion.patch", "value" : [ { "op": "add", "path": "/claims/SAML Inline Hook Values - Fetched from DB" , "value" : { "attributes" : { "NameFormat" : "urn:oasis:names:tc:SAML:2.0:attrname-format:basic" }, "attributeValues" : [ { "attributes" : { "xsi:type" : "xs:string" }, "value" : "'+data[i][1]+'" } ] } } ] } ] }');
                        }                        
                    }
                    return res.status(201).send('{ "commands" :[ { "type" : "com.okta.assertion.patch", "value" : [ { "op": "add", "path": "/claims/SAML Inline Hook Values - Fetched from DB" , "value" : { "attributes" : { "NameFormat" : "urn:oasis:names:tc:SAML:2.0:attrname-format:basic" }, "attributeValues" : [ { "attributes" : { "xsi:type" : "xs:string" }, "value" : "'+TestValue+'" } ] } } ] } ] }');
                });
            });
        }

    }
    catch (error) {
        return res.status(400).send(`Error: Bad Request`)
    }
});






/*
app.get("/userdata", function(req, res){
    var sql = "select * from user"
    var params = []
    db.all(sql, params, (err, rows) => {
        return res.json({
            "data":rows
        })
      });
});
*/















// ######################### Older Version with Extra Codes ############################ //

/*

const app = express();

const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.urlencoded());

//var hashed = true;

//const jsonString02 = '{ "commands" :[ { "type" : "com.okta.assertion.patch", "value" : [ { "op": "add", "path": "/claims/newAssertionAttribute" , "value" : { "attributes" : { "NameFormat" : "urn:oasis:names:tc:SAML:2.0:attrname-format:basic" }, "attributeValues" : [ { "attributes" : { "xsi:type" : "xs:string" }, "value" : "TestValue" } ] } } ] } ] }';
const jsonString01 = '{ "commands" :[ { "type" : "com.okta.assertion.patch", "value" : [ { "op": "add", "path": "/claims/SAML Inline Hook Values - Fetched from DB" , "value" : { "attributes" : { "NameFormat" : "urn:oasis:names:tc:SAML:2.0:attrname-format:basic" }, "attributeValues" : [ { "attributes" : { "xsi:type" : "xs:string" }, "value" : '+TestValue+' } ] } } ] } ] }';

//var userName, password;

//function hashPassword(pwd) {
  //  return ssha512(pwd,'S@lTAdding123');
  //}

app.listen(PORT, () => console.log(`Listening on ${ PORT }`));
app.get('/', function (req, res){ res.sendFile(path.join(__dirname + '/toShow.html'));});
app.post('/hook', function(req, res){

    try {
        //userName = req.body.data.context.credential['username'];
        //password =  req.body.data.context.credential['password'];
        //savedPassword = hashPassword(password);

        issuerId = req.body.data.context.protocol.issuer['uri'];
        userName = req.body.data.context.user.profile['login'];

        if(issuerId === "http://www.okta.com/exk4xwhkchA4xQZZ94x7"){
            fs.readFile(datatoread, 'UTF-8', function (err, filecontent) {
                csv.toArrays(filecontent, {}, function (err, data) {
                    for (var i = 0, len = data.length; i < len; i++) {
                        if(data[i][0] === userName){
                            TestValue = data[i][1];
                            res.status(201).send(jsonString01);
                        }
                    }
                });
            });
        }

        //res.status(201).send(jsonString01);

        fs.readFile(datatoread, 'UTF-8', function (err, filecontent) {
            csv.toArrays(filecontent, {}, function (err, data) {
                for (var i = 0, len = data.length; i < len; i++) {
                    if(data[i][0] === userName){
                        if(data[i][1] === password || data[i][1] === savedPassword){
                            var sql ='INSERT INTO user (userName, password) VALUES (?,?)'
                            var params =[userName, savedPassword]
                            db.run(sql, params, function (err, result){});
                            return res.status(201).send(jsonString01);
                        } 
                    }
                }
                return res.status(201).send(jsonString02);
            });
        });

    }
    catch (error) {
        return res.status(400).send(`Error: Bad Request`)
    }
});

*/

/*
app.get("/userdata", function(req, res){
    var sql = "select * from user"
    var params = []
    db.all(sql, params, (err, rows) => {
        return res.json({
            "data":rows
        })
      });
});
*/
