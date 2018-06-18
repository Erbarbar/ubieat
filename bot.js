//var express    = require('express');
const bodyParser = require('body-parser');
const Slack      = require('slack-node');

const slack = new Slack();

const bot_link = process.env.LINK;

slack.setWebhook(bot_link);

console.log("LINK = " + bot_link);

slack.webhook(
    {
        channel: "#ubi-eat",
        username: "test",
        text: "Hello World!"
    }, 
    function(err, response) {
        if (err === null)
            console.log("sent message");
        else{
            console.log(err);
            console.log(response);
        }
    }
);
