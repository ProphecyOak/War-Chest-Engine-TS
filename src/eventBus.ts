type EventHandler<T> = (event: T, payload: any) => void;

class Subscription {
  private eventBus: EventBus<any>;
  private key: number;
  constructor(eventBus: EventBus<any>, key: number) {
    this.eventBus = eventBus;
    this.key = key;
  }
  unsubscribe() {
    this.eventBus.unsubscribe(this.key);
  }
}

class EventBus<T> {
  private handlers: Map<number, EventHandler<T>> = new Map();
  nextKey = 0;

  getKey() {
    let key = this.nextKey;
    this.nextKey += 1;
    return key;
  }

  fire(event: T, payload?: any): void {
    this.handlers.forEach((handler) => handler(event, payload));
  }

  subscribe(handler: EventHandler<T>): Subscription {
    let key = this.getKey();
    this.handlers.set(key, handler);
    return new Subscription(this, key);
  }

  unsubscribe(handlerKey: number): void {
    this.handlers.delete(handlerKey);
  }
}
