//var express    = require('express');
const bodyParser = require('body-parser');
const Slack      = require('slack-node');

const slack = new Slack();

const bot_link = process.env.LINK;

slack.setWebhook(bot_link);



testMessage(createMessageText());



function testMessage(message){
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
                console.log("[Message sent]:\n" + message);
            else{
                console.log(err);
                console.log(response);
            }
        }
    );
}


function createMessageText(){
    return "Menú IPN:\n:bowl_with_spoon: *Sopa do dia*: Canja de galinha\n:meat_on_bone: *Carne*: Lasanha de carne\n:ear_of_rice: *Vegetariano*: Lasanha de espinafres";
}
