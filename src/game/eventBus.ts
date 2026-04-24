export type EventHandler<T> = (event: T) => void;

export interface ISubscription {
  unsubscribe(): void;
}

class Subscription<T> implements ISubscription {
  private eventBus: EventBus<T>;
  private key: string;
  constructor(eventBus: EventBus<T>, key: string) {
    this.eventBus = eventBus;
    this.key = key;
  }
  unsubscribe(): void {
    this.eventBus.unsubscribe(this.key);
  }
}

export interface IEventBus<T> {
  fire(event: T, payload?: any): void;
  subscribe(handler: EventHandler<T>): ISubscription;
  unsubscribe(key: string): void;
}

export class EventBus<T> implements IEventBus<T> {
  private handlers: Map<string, EventHandler<T>> = new Map();
  protected nextKey = 0;

  protected constructor() {}

  protected generateKey() {
    return `key_${Date.now()}-${Math.random()}`;
  }

  fire(event: T): void {
    this.handlers.forEach((handler) => handler(event));
  }

  subscribe(handler: EventHandler<T>): ISubscription {
    let key = this.generateKey();
    this.handlers.set(key, handler);
    return new Subscription(this, key);
  }

  unsubscribe(handlerKey: string): void {
    this.handlers.delete(handlerKey);
  }
}
