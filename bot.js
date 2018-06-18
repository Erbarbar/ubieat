//var express    = require('express');
const bodyParser = require('body-parser');
const Slack      = require('slack-node');
var Tesseract = require('tesseract.js'); // for image text recognition
var request = require('request');
var fs = require('fs');

var logs = false;

// point bot to slack channel
const bot_link = process.env.LINK; // no hack, pls
const slack = new Slack();
slack.setWebhook(bot_link); // the channel is defined on slack app settings


//IPN menu image
var url = "https://scontent.fopo2-1.fna.fbcdn.net/v/t1.0-9/35464654_1759158370816852_1085733037682982912_n.jpg?_nc_cat=0&oh=a9bd7f868dc5639d416aa380a5967078&oe=5BA595FF";

//test image
//var url = "http://tesseract.projectnaptha.com/img/eng_bw.png"
var filename = "pic.png";




// download image
downloadImage(url,filename);


//testMessage(createMessageText());


// FUNCTIONS --------------------------------------------------

// Downloads image from <input> to <output>
function downloadImage(input, output){

    if(logs) console.log("downloading image from [" + input + "] to [" + output +"]");
    var writeFileStream = fs.createWriteStream(output);
    request(input).pipe(writeFileStream).on('close', function() {
      readImage(output);
    });
}


function readImage(image){
    if(logs) console.log("reading image from: [" + image + "]");
    var tesseractPromise = Tesseract
        .recognize(image, 'eng')
        .progress(function  (p) { if(logs) console.log('progress', p)  })
        .catch(err => console.error(err))
        .then(function (result) {
            doSomethingWithText(result.text);
        });
}

function doSomethingWithText(text){
    if(logs) console.log(text);
    testMessage(text);
}

// sends <message> as a text message to slack 
function testMessage(message){
    if(logs) console.log("Sending message");
    slack.webhook(
        {
            text: "Chegou a hora de escolher!",
            attachments:
            [
                {   
                    mrkdwn_in:"text",
                    text: message,
                    fallback: "Ups, parece que não dá para votar...",
                    callback_id: "vote",
                    color: "#3AA3E3"/*,
                    uncomment to add button
                    actions:
                    [
                        {   
                            name: "button",
                            text: "Votar",
                            type: "button",
                            value: "ipn"
                        }
                    ]*/
                }

            ]
        }, 
        function(err, response) {
            if (err === null)
                if(logs) console.log("[Message sent]:\n" + message);
            else{
                if(logs) console.log(err);
                if(logs) console.log(response);
            }
            process.exit(0);
        }
    );
}


function createMessageText(){
    return "Menú IPN:\n:bowl_with_spoon: *Sopa do dia*: Canja de galinha\n:meat_on_bone: *Carne*: Lasanha de carne\n:ear_of_rice: *Vegetariano*: Lasanha de espinafres";
}
