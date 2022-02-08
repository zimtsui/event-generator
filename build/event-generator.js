"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventGenerator = void 0;
const coroutine_locks_1 = require("coroutine-locks");
const deque_1 = require("deque");
class Wake extends Error {
    constructor() { super('wake'); }
}
async function* EventGenerator(emitter, event) {
    const queue = (0, deque_1.Deque)();
    const semaphore = new coroutine_locks_1.Semaphore();
    function listener(...payload) {
        queue.push(payload);
        semaphore.v();
    }
    emitter.on(event, listener);
    emitter.once('error', () => {
        semaphore.throw(new Wake());
    });
    try {
        for (;;) {
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