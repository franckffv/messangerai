import { openai } from "./openaiApi.js";

async function createMessage(thread, message) {
    return await new Promise(async (resolve, reject) => {
        const myMessage = await openai.beta.threads.messages.create(
            thread,
            { role: "user", content: message },
        );
        resolve(myMessage);
    });
}

async function listMessages(thread) {
    const res = await new Promise(async (resolve, reject) => {
        const threadMessages = await openai.beta.threads.messages.list(
            thread,
            { order: "desc", limit: 20 },
        );
        resolve(threadMessages);
    });
    return res;
}

async function retrieveMessage(thread, messageid) {
    const message = await openai.beta.threads.messages.retrieve(
        thread,
        messageid,
    );
    return message;
}

export default {
    createMessage,
    listMessages,
    retrieveMessage
}
