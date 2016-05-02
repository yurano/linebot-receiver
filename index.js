'use strict';

const crypto = require('crypto');
const AWS = require('aws-sdk');
const CONFIG = require('./config');

const CHANNEL_SECRET = CONFIG.channelSecret;
const SIGNATURE_HEADER = CONFIG.signatureHeader || "X-Line-ChannelSignature";

exports.handler = (event, context, callback) => {
  // signature validation
  const bodyString = JSON.stringify(event.body);
  const hmac = crypto.createHmac('sha256', CHANNEL_SECRET);
  const bodyBuffer = new Buffer(bodyString, 'utf8');
  hmac.update(bodyBuffer);
  const signature = hmac.digest('base64');
  const validation = signature === event.headers[SIGNATURE_HEADER];

  if (!validation) {
    callback(new Error('Invalid signature.'));
  }

  // publish
  if (validation) {
    let params = {};
    params.MessageStructure = 'json';
    params.Message = bodyString;
    params.Subject = CONFIG.messageSubject || 'Receiving messages from LINE BOT API';
    params.TopicArn = CONFIG.topicArn;

    let sns = new AWS.SNS({'apiVersion': '2010-03-31'});
    sns.publish(params, (err, data) => {
      if (err) {
        callback(err);
      } else {
        console.info('Published to an AWS SNS topic.');
        console.info('MessageId: ', data.MessageId);
      }
    });
  }
};
