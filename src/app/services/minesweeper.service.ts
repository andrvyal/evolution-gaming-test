import { Injectable } from '@angular/core';

import { MinesweeperCell, MinesweeperCommand, MinesweeperStatus } from '../helpers/minesweeper';
import { SocketApiService } from './socket-api.service';

@Injectable({
  providedIn: 'root'
})
export class MinesweeperService {

  private flags: Array<Array<boolean>>;
  private map: Array<Array<string>>;
  private responseStatus: MinesweeperStatus;

  constructor(
    private socketApiService: SocketApiService,
  ) { }

  forEach(callback: (rowIndex: number, colIndex: number) => void): void {
    for (let rowIndex = 0; rowIndex < this.map.length; ++rowIndex) {
      const row: Array<string> = this.map[rowIndex];

      for (let colIndex = 0; colIndex < row.length; ++colIndex) {
        callback.bind(this)(rowIndex, colIndex);
      }
    }
  }

  getValue(rowIndex: number, colIndex: number): number {
    if (!this.isOpen(rowIndex, colIndex)) {
      throw new Error(`${colIndex} ${rowIndex} is not open yet`);
    } else if (this.isMine(rowIndex, colIndex)) {
      throw new Error(`${colIndex} ${rowIndex} is mine`);
    } else {
      const cell: string = this.map[rowIndex][colIndex];
      return Number(cell);
    }
  }

  get grid(): Array<Array<string>> {
    return JSON.parse(JSON.stringify(this.map));
  }

  get height(): number {
    return this.map.length;
  }

  private initFlags(): void {
    this.flags = [];

    for (let rowIndex = 0; rowIndex < this.height; ++rowIndex) {
      const row: Array<boolean> = [];

      for (let colIndex = 0; colIndex < this.width; ++colIndex) {
        row.push(false);
      }

      this.flags.push(row);
    }
  }

  private isClosed(rowIndex: number, colIndex: number): boolean {
    const cell: string = this.map[rowIndex][colIndex];
    return cell === MinesweeperCell.Closed;
  }

  isFlagged(rowIndex: number, colIndex: number): boolean {
    const closed: boolean = this.isClosed(rowIndex, colIndex);
    const flagged: boolean = this.flags[rowIndex][colIndex];

    return closed && flagged;
  }

  isMine(rowIndex: number, colIndex: number): boolean {
    const cell: string = this.map[rowIndex][colIndex];
    return cell === MinesweeperCell.Mine;
  }

  isOpen(rowIndex: number, colIndex: number): boolean {
    const closed: boolean = this.isClosed(rowIndex, colIndex);
    return !closed;
  }

  isUnknown(rowIndex: number, colIndex: number): boolean {
    const closed: boolean = this.isClosed(rowIndex, colIndex);
    const flagged: boolean = this.isFlagged(rowIndex, colIndex);

    return closed && !flagged;
  }

  async open(rowIndex: number, colIndex: number): Promise<string> {
    const response: string = await this.socketApiService.run(`${MinesweeperCommand.Open} ${colIndex} ${rowIndex}`);
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
    this.initFlags();
  }

  get status(): MinesweeperStatus {
    return this.responseStatus;
  }

  toggleFlag(rowIndex: number, colIndex: number): void {
    this.flags[rowIndex][colIndex] = !this.flags[rowIndex][colIndex];
  }

  get width(): number {
    return this.map[0].length;
  }
}
