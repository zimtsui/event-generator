import { EventEmitter } from 'events';
import { ElementType } from 'deque';
export declare function EventGenerator<Payload extends ElementType>(emitter: EventEmitter, event: Parameters<EventEmitter['on']>[0]): AsyncGenerator<Payload, void>;
