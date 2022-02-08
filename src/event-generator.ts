import { EventEmitter } from 'events';
import { Semaphore } from 'coroutine-locks';
import { Deque } from 'deque';

class Wake extends Error {
	constructor() { super('wake'); }
}

export async function* EventGenerator<Payload extends unknown[]>(
	emitter: EventEmitter,
	event: Parameters<EventEmitter['on']>[0],
): AsyncGenerator<Payload> {
	const queue = Deque<any>();
	const semaphore = new Semaphore();
	function listener(...payload: any[]): void {
		queue.push(payload);
		semaphore.v();
	}
	emitter.on(event, listener);
	emitter.once('error', () => {
		semaphore.throw(new Wake());
	});
	try {
		for (; ;) {
			await semaphore.p();
			yield queue.shift();
		}
	} finally {
		emitter.off(event, listener);
	}
}
