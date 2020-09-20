import { Injectable } from '@angular/core';

import { MinesweeperCell, MinesweeperCommand, MinesweeperStatus } from '../helpers/minesweeper';
import { SocketApiService } from './socket-api.service';

@Injectable({
  providedIn: 'root'
})
export class MinesweeperService {

  private map: Array<Array<string>>;

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

  async open(row: number, col: number): Promise<boolean> {
    const response: string = await this.socketApiService.run(`${MinesweeperCommand.Open} ${col} ${row}`);
    await this.retrieveMap();

    const sussess: boolean = (response === `${MinesweeperCommand.Open}: ${MinesweeperStatus.Success}`);

    return sussess;
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
    //
    console.log('map', this.map);
    //
  }

  async start(level: number): Promise<void> {
    const response: string = await this.socketApiService.run(`${MinesweeperCommand.New} ${level}`);

    if (response !== `${MinesweeperCommand.New}: ${MinesweeperStatus.Success}`) {
      return Promise.reject(response);
    }

    await this.retrieveMap();
  }
}
