import AWS from 'aws-sdk';
import Bot from "slackbots";
import {TOKEN} from "./secrets";
import {encode} from 'node-base64-image';

AWS.config.update({region: 'eu-west-1'});

const rekognition = new AWS.Rekognition();

// create a bot
const settings = {
    token: TOKEN,
    name: 'SeeingEyeBot'
};

const bot = new Bot(settings);

// give him a face
const params = {
    icon_emoji: ':robot_face:'
};

// define group or channel that we are posting to
const channelOrGroup = 'group';
const postOrGroupName = 'jono_button_test';

// function to send a message to either a group (private channel) or a channel
function sendMessage(messageText) {
    if (channelOrGroup === 'channel') {
        bot.postMessageToChannel(postOrGroupName, messageText, params);
    }
    else {
        bot.postMessageToGroup(postOrGroupName, messageText, params);
    }
}

function tellMeWhatThisIs(base64Image) {
    rekognition.detectLabels({
        Image: {
            Bytes: base64Image
        }
    }, function (err, data) {
        if (err)
            console.log(err);
        else
            sendMessage(`That looks like ${data.Labels[0].Name} or a ${data.Labels[1].Name} to me`);
    });
}

bot.on('message', function (data) {
    // all ingoing events https://api.slack.com/rtm
    console.log(data);

    // check that the message has text
    if (data.text) {
        // start a new game
        if (data.text.toUpperCase().startsWith('@WHAT-IS-THIS-BOT WHAT IS THIS?')) {
            console.log('we have a match');
            let url = data.text.substring('@WHAT-IS-THIS-BOT WHAT IS THIS?'.length + 2, data.text.length - 1);
            console.log(url);
            encode(url, {}, (error, result) => tellMeWhatThisIs(result));
        }
    }
});