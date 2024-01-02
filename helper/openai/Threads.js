import { openai } from "./openaiApi.js";

async function createThread() {
  return await new Promise(async (resolve, reject) => {
      const emptyThread = await openai.beta.threads.create();
      resolve(emptyThread);
    })
}

export default createThread;
