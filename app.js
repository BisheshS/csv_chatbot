"use strict";

// This loads the environment variables from the .env file
require('dotenv-extended').load();
var http = require('http');
var builder = require('botbuilder');
var restify = require('restify');
var Promise = require('bluebird');
var request = require('request-promise').defaults({ encoding: null });
var fs = require('fs');
var csv = require('fast-csv');


// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
    console.log('%s listening to %s', server.name, server.url);
});

// Create chat bot
var connector = new builder.ChatConnector({
    appId: null,
    appPassword: null
});

// Listen for messages
server.post('/api/messages', connector.listen());


// Create your bot with a function to receive messages from the user
var bot = new builder.UniversalBot(connector, function (session) {
    var msg = session.message;
    if (msg.attachments && msg.attachments.length > 0) {
     // Echo back attachment
     var attachment = msg.attachments[0];
     //link = attachment.contentUrl;
        session.send({
            text: "You sent:",
            attachments: [
                {
                    contentType: attachment.contentType,
                    contentUrl: attachment.contentUrl,
                    name: attachment.name
                }
            ]
        });


        


    // http.get(attachment.contentUrl, res => res.pipe(fs.createWriteStream('1.csv')));
    
        
//Reads the CSV data
var stream = fs.createReadStream('University Dataset/studentAssessment.csv');
                csv
                    .fromStream(stream, {headers : true})
                    .on("data", function(data){
                         console.log("Start of parsing...");
                         console.log(data);
                    })
                    .on("end", function(data){
                         console.log(data);
                         console.log("End of parsing");
                    })
        /*3/http.get(attachment.contentUrl, function(res) {
        console.log("Got response: " + res.statusCode);
            }).on('error', function(e) {
        console.log("Got error: " + e.message);
            });

        fs.createReadStream("addresses.csv")
    .pipe(csv())
    .on("data", function(data){
         console.log(data);
    })
    .on("end", function(){
         console.log("done");
    });*/
     
    } else {
        // Echo back users text
        session.send("You said: %s", session.message.text);
    }
});

// Request file with Authentication Header
var requestWithToken = function (url) {
    return obtainToken().then(function (token) {
        return request({
            url: url,
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/octet-stream'
            }
        });
    });
};


    

    
// Promise for obtaining JWT Token (requested once)
var obtainToken = Promise.promisify(connector.getAccessToken.bind(connector));

var checkRequiresToken = function (message) {
    return message.source === 'skype' || message.source === 'msteams';
};
