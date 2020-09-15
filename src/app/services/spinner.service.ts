import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SpinnerService {

  private count = 0;
  private stateChangeObserver: Subject<boolean> = new Subject<boolean>();
  private stateChangeObservable: Observable<boolean> = this.stateChangeObserver.asObservable();

  constructor() { }

  start(): void {
      if (!this.count) {
          this.stateChangeObserver.next(true);
      }

      ++this.count;
  }

  get stateChange(): Observable<boolean> {
      return this.stateChangeObservable;
  }

  stop(): void {
      this.count = Math.max(this.count - 1, 0);

      setTimeout(() => {
          if (!this.count) {
              this.stateChangeObserver.next(false);
          }
      });
  }
}
