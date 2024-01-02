import { Router } from 'express';
import dotenv from 'dotenv';
import { getThreadbyid } from '../helper/manageUsers.js';
import { createMessage, listMessages } from '../helper/openai/Messages.js';
import { createRun, waitRun } from '../helper/openai/Runs.js';
import { sendMessage } from '../helper/messengerApi';

const router = Router();

dotenv.config();

router.get('/', (req, res) => {
  let mode = req.query['hub.mode'];
  let token = req.query['hub.verify_token'];
  let challenge = req.query['hub.challenge'];
  if (mode && token) {
    if (mode === 'subscribe' && token === process.env.VERIFY_TOKEN) {
      console.log('WEBHOOK_VERIFIED');
      res.status(200).send(challenge);
    } else {
      res.sendStatus(403);
    }
  }
});

router.post('/', async (req, res) => {
  try {
    let body = req.body;
    let requestType = body.object;
    let senderId = body.entry[0].messaging[0].sender.id;
    let query = body.entry[0].messaging[0].message.text;
    var thread = await getThreadbyid(senderId);
    var messages = await createMessage(thread.id, query);
    var run = await createRun(thread.id, process.env.ASSISTANT_ID);
    var run = await waitRun(thread.id, run.id);
    var messages = await listMessages(thread.id);
    var response = messages.data[0].content[0].text.value;
    await sendMessage(senderId, response);
  } catch (error) {
    console.log(error);
  }
  res.status(200).send('OK');
});

export default {
  router
};
