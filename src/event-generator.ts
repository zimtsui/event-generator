import { EventEmitter } from 'events';
import { Semaphore } from 'coroutine-locks';
import { Deque, ElementType } from 'deque';


export async function* EventGenerator<Payload extends ElementType>(
	emitter: EventEmitter,
	event: Parameters<EventEmitter['on']>[0],
): AsyncGenerator<Payload, void> {
	const queue = Deque.create<Payload>();
	const semaphore = new Semaphore();
	function listener(payload: Payload): void {
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
	} finally {
		emitter.off(event, listener);
	}
}
