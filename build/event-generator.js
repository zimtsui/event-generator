"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventGenerator = void 0;
const coroutine_locks_1 = require("coroutine-locks");
const deque_1 = require("deque");
async function* EventGenerator(emitter, event) {
    const queue = deque_1.Deque.create();
    const semaphore = new coroutine_locks_1.Semaphore();
    function listener(payload) {
        queue.push(payload);
        semaphore.v();
    }
    emitter.on(event, listener);
    emitter.once('error', err => {
        semaphore.throw(err);
    });
    try {
        while (true) {
            await semaphore.p();
            yield queue.shift();
        }
    }
    finally {
        emitter.off(event, listener);
    }
}
exports.EventGenerator = EventGenerator;
//# sourceMappingURL=event-generator.js.map