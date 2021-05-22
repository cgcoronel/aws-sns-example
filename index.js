const AWS = require('aws-sdk');
const config = require('config');
const { region } = config.get('AWS');

AWS.config.update({ region });

const SNS = new AWS.SNS();

/**
 * Set the sms delivery in transactional mode.
 * Params void
 * Return promise
 */
const configureSNS = () => {
  const params = {
    attributes: {
      DefaultSMSType: 'Transactional',
    },
  };
  return SNS.setSMSAttributes(params).promise();
};

/**
 * Publish an SMS using SNS client.
 * Params
 *   phoneNumber: string,
 *   text: string,
 * Return promise
 */
const publishSMS = async (phoneNumber, text) => {
  //Set delivery mode, first.
  await configureSNS();
  //Make sms payload.
  const params = {
    Message: text,
    MessageStructure: 'text',
    PhoneNumber: phoneNumber,
  };
  return await SNS.publish(params).promise();
};

const sendSms = (areaCode, phoneNumber, text) =>
  publishSMS(areaCode + phoneNumber, text);

const exec = async () => {
  try {
    await sendSms('+54', '11XXXXXXXX', 'Sample message');
  } catch (error) {
    console.log(error);
  }
};

exec();

module.exports = {
  sendSms,
};
