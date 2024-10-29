import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class TriggerEventService {
  constructor(private readonly eventEmitter: EventEmitter2) {}

  public queueEventEmitter(eventName: string, data: any) {
    this.eventEmitter.emit(eventName, data);
  }
}
