import createThread from './openai/Threads.js';

var user = [];

function getThreadbyid(id) {
  var thread = user.find((element) => element.id === id);
  if (thread === undefined) {
    thread = createThread(id);
    user.push({id: id, thread: thread});
  } else {
    thread = thread.thread;
  }
  return thread;
}

module.exports = {
  getThreadbyid
};
