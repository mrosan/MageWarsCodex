import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class EmitterService {
  onWideScreen: EventEmitter<boolean> = new EventEmitter();
  onTabChange: EventEmitter<string> = new EventEmitter();

  constructor() {}

  emitWideScreen(val: boolean) {
    this.onWideScreen.emit(val);
  }

  emitTab(val: string) {
    this.onTabChange.emit(val);
  }
}
