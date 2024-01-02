import { request } from 'axios';

import dotenv from 'dotenv';

dotenv.config();

const TOKEN = process.env.TOKEN;
const PAGE_ID = process.env.PAGE_ID;

const sendButtonMessage = async (name) => {
  const buttonMessage = {
    text: `What do you want to do next ${name.name}?`,
    buttons: [
      { type: 'postback', title: 'Button 1', payload: 'BUTTON1_PAYLOAD' },
      { type: 'postback', title: 'Button 2', payload: 'BUTTON2_PAYLOAD' },
      { type: 'web_url', url: 'https://www.example.com', title: 'Visit Website' },
    ],
  };
  const options = {
    method: 'POST',
    url: `https://graph.facebook.com/v12.0/${PAGE_ID}/messages`,
    params: {
      access_token: TOKEN,
      recipient: JSON.stringify({ 'id': "6740120186050751" }),
      messaging_type: 'RESPONSE',
      message: JSON.stringify({
        attachment: {
          type: 'template',
          payload: {
            template_type: 'button',
            text: buttonMessage.text,
            buttons: buttonMessage.buttons,
          },
        },
      }),
    },
  };

  try {
    const response = await request(options);
    if (response.status === 200 && response.statusText === 'OK') {
      return 1;
    } else {
      return 0;
    }
  } catch (error) {
    console.error('Error sending button message:', error.message);
    return 0;
  }
};

const sendMessage = async (senderId, message) => {

  let options = {
    method: 'POST',
    url: `https://graph.facebook.com/v11.0/${PAGE_ID}/messages`,
    params: {
      access_token: TOKEN,
      recipient: JSON.stringify({ 'id': senderId }),
      messaging_type: 'RESPONSE',
      message: JSON.stringify({ 'text': message })
    }
  };

  let response = await request(options);

  if (response['status'] == 200 && response['statusText'] === 'OK') {
    return 1;
  } else {
    return 0;
  }
};

export default {
  sendMessage,
  sendButtonMessage
}