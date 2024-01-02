import { openai } from "./openaiApi.js";
import { sendButtonMessage } from "../messengerApi.js";

const AllFunctions = {
  hello: sendButtonMessage,
}

async function createRun(thread, assistant) {
    return await new Promise(async (resolve, reject) => {
        const run = await openai.beta.threads.runs.create(
            thread,
            { assistant_id: assistant }
        );
        resolve(run);
    });
}

async function listRuns(thread) {
    const runs = await openai.beta.threads.runs.list(
        thread,
        { order: "asc", limit: 20 },
    );
    return runs;
}
async function retrieveRun(thread, runid) {
    const run = await openai.beta.threads.runs.retrieve(
        thread,
        runid,
    );
    return run;
}

async function Submittooloutputs(thread, runid, tools) {
    return await new Promise(async (resolve, reject) => {
        const run = await openai.beta.threads.runs.submitToolOutputs(
            thread,
            runid,
            tools,
        );
        resolve(run);
    })
}

async function waitRun(thread, runid) {
    return await new Promise(async (resolve, reject) => {
        let run = await retrieveRun(thread, runid);
        do {
            run = await retrieveRun(thread, runid);
            if (run.status === "requires_action") {
                const tools = {
                    tool_outputs: run.required_action.submit_tool_outputs.tool_calls.map((tool) => {
                        const function_name = tool.function.name;
                        const arg = JSON.parse(tool.function.arguments);
                        AllFunctions[function_name](arg);
                        return {
                            tool_call_id: tool.id,
                            output: "",
                        };
                    })
                }
                run = await Submittooloutputs(thread, runid, tools);
            }
        } while (run.status === "in_progress");
        resolve(run);
    });
}


export default {
    createRun,
    listRuns,
    retrieveRun,
    waitRun
}
