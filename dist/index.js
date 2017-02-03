"use strict";

var _awsSdk = require("aws-sdk");

var _awsSdk2 = _interopRequireDefault(_awsSdk);

var _slackbots = require("slackbots");

var _slackbots2 = _interopRequireDefault(_slackbots);

var _secrets = require("./secrets");

var _nodeBase64Image = require("node-base64-image");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// change this to the region you want
_awsSdk2.default.config.update({ region: 'eu-west-1' });

var rekognition = new _awsSdk2.default.Rekognition();

// create a bot
var settings = {
    token: _secrets.TOKEN,
    name: 'SeeingEyeBot'
};

var bot = new _slackbots2.default(settings);

// give him a face
var params = {
    icon_emoji: ':robot_face:'
};

// define group or channel that we are posting to
var channelOrGroup = 'channel';
var postOrGroupName = 'general';

// function to send a message to either a group (private channel) or a channel
function sendMessage(messageText) {
    if (channelOrGroup === 'channel') {
        bot.postMessageToChannel(postOrGroupName, messageText, params);
    } else {
        bot.postMessageToGroup(postOrGroupName, messageText, params);
    }
}

// send image to AWS Rekognition and send a message with the results
function queryRekognition(base64Image) {
    rekognition.detectLabels({
        Image: {
            Bytes: base64Image
        }
    }, function (err, data) {
        if (err) console.log(err);else sendMessage("That looks like a " + data.Labels[0].Name.toLocaleLowerCase() + " or a " + data.Labels[1].Name.toLocaleLowerCase() + " to me");
    });
}

// listen for messages to
bot.on('message', function (data) {
    // all ingoing events https://api.slack.com/rtm
    console.log(data);

    // check that the message has text
    if (data.text) {
        // start a new game
        if (data.text.toUpperCase().startsWith('@WHAT-IS-THIS-BOT WHAT IS THIS')) {
            console.log('we have a match');
            var url = data.text.substring('@WHAT-IS-THIS-BOT WHAT IS THIS'.length + 2, data.text.length - 1);
            console.log(url);
            (0, _nodeBase64Image.encode)(url, {}, function (error, result) {
                return queryRekognition(result);
            });
        }
    }
});
//# sourceMappingURL=index.js.map