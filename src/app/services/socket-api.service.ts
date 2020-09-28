import { Injectable } from '@angular/core';

import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SocketApiService {

  private actionResolve: ((result: string) => void);
  private initPromise: Promise<void>;
  private socket: WebSocket;

  constructor() {
    this.initPromise = new Promise((resolve: ((value: void) => void)) => {
      this.socket = new WebSocket(environment.socketUrl);

      this.socket.addEventListener('open', () => {
        resolve();
      });

      this.socket.addEventListener('close', (event: MessageEvent) => {
        this.handleClose(event);
      });

      this.socket.addEventListener('error', (event: MessageEvent) => {
        this.handleError(event);
      });

      this.socket.addEventListener('message', (event: MessageEvent) => {
        this.handleMessage(event);
      });
    });
  }

  private handleClose(event: MessageEvent): void {
    alert('Connection interrupted');
  }

  private handleError(event: MessageEvent): void {
    alert('Connection error');
  }

  private handleMessage(event: MessageEvent): void {
    if (this.actionResolve) {
      this.actionResolve(event.data);
      this.actionResolve = null;
    }
  }

  get ready(): Promise<void> {
    return this.initPromise;
  }

  run(command: string): Promise<string> {
    const actionPromise: Promise<string> = new Promise((resolve: ((result: string) => void)) => {
      this.actionResolve = resolve;
    });

    this.socket.send(command);

    return actionPromise;
  }
}
