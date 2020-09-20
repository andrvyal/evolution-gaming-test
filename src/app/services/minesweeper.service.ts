import { Injectable } from '@angular/core';

import { MinesweeperCell, MinesweeperCommand, MinesweeperStatus } from '../helpers/minesweeper';
import { SocketApiService } from './socket-api.service';

@Injectable({
  providedIn: 'root'
})
export class MinesweeperService {

  private map: Array<Array<string>>;
  private responseStatus: MinesweeperStatus;

  constructor(
    private socketApiService: SocketApiService,
  ) { }

  get grid(): Array<Array<string>> {
    return JSON.parse(JSON.stringify(this.map));
  }

  isClosed(cell: string): boolean {
    return cell === MinesweeperCell.Closed;
  }

  isMine(cell: string): boolean {
    return cell === MinesweeperCell.Mine;
  }

  async open(row: number, col: number): Promise<string> {
    const response: string = await this.socketApiService.run(`${MinesweeperCommand.Open} ${col} ${row}`);
    await this.retrieveMap();

    const result: string = response.replace(`${MinesweeperCommand.Open}: `, '');

    if (result.indexOf(MinesweeperStatus.Ok) === 0) {
      this.responseStatus = MinesweeperStatus.Ok;
    } else if (result.indexOf(MinesweeperStatus.Lose) === 0) {
      this.responseStatus = MinesweeperStatus.Lose;
    } else if (result.indexOf(MinesweeperStatus.Win) === 0) {
      this.responseStatus = MinesweeperStatus.Win;
    }

    return result;
  }

  get ready(): Promise<void> {
    return this.socketApiService.ready;
  }

  private async retrieveMap(): Promise<void> {
    const mapResponse: string = await this.socketApiService.run(`${MinesweeperCommand.Map}`);
    const mapLines: Array<string> = mapResponse.split('\n').slice(1, -1);

    this.map = mapLines.map((line: string) => {
      return line.split('');
    });
  }

  async start(level: number): Promise<void> {
    const response: string = await this.socketApiService.run(`${MinesweeperCommand.New} ${level}`);

    if (response !== `${MinesweeperCommand.New}: ${MinesweeperStatus.Ok}`) {
      return Promise.reject(response);
    }

    await this.retrieveMap();
  }

  get status(): MinesweeperStatus {
    return this.responseStatus;
  }
}
