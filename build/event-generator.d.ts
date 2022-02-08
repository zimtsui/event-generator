import { EventEmitter } from 'events';
export declare function EventGenerator<Payload extends unknown[]>(emitter: EventEmitter, event: Parameters<EventEmitter['on']>[0]): AsyncGenerator<Payload>;
