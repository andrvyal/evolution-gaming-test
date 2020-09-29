import { Component, OnInit } from '@angular/core';

import { environment } from '../../../environments/environment';
import { MinesweeperCellCoordinates, MinesweeperStatus } from '../../helpers/minesweeper';
import { MinesweeperService } from '../../services/minesweeper.service';
import { MinesweeperBotService } from '../../services/minesweeper-bot.service';
import { SpinnerService } from '../../services/spinner.service';

@Component({
  selector: 'egt-minesweeper',
  templateUrl: './minesweeper.component.html',
  styleUrls: ['./minesweeper.component.scss']
})
export class MinesweeperComponent implements OnInit {

  automated = false;
  finished = false;
  grid: Array<Array<string>>;
  levels: Array<number>;
  opening = false;
  ready = false;
  started = false;

  constructor(
    private minesweeperService: MinesweeperService,
    private minesweeperBotService: MinesweeperBotService,
    private spinnerService: SpinnerService,
  ) {
    this.levels = Array.from(Array(environment.levelCount)).map((value: number, index: number): number => {
      return index + 1;
    });
  }

  async ngOnInit(): Promise<void> {
    this.spinnerService.start();

    try {
      await this.minesweeperService.ready;
      this.ready = true;
    } finally {
      this.spinnerService.stop();
    }
  }

  private nextMove(): void {
    setTimeout(async () => {
      const nextCell: MinesweeperCellCoordinates = this.minesweeperBotService.nextMove();
      await this.open(nextCell);
    });
  }

  onAutomatedChange(automated: boolean): void {
    this.automated = automated;

    if (this.automated) {
      this.nextMove();
    }
  }

  async open({rowIndex, colIndex}: MinesweeperCellCoordinates): Promise<void> {
    this.opening = true;

    try {
      const result: string = await this.minesweeperService.open(rowIndex, colIndex);
      this.grid = this.minesweeperService.grid;

      switch (this.minesweeperService.status) {
        case MinesweeperStatus.Ok:
          if (this.automated) {
            this.nextMove();
          }
          break;
        case MinesweeperStatus.Lose:
        case MinesweeperStatus.Win:
          this.finished = true;

          setTimeout(() => {
            alert(result);
          });

          break;
      }
    } finally {
      this.opening = false;
    }
  }

  async start(level: number): Promise<void> {
    this.spinnerService.start();

    try {
      await this.minesweeperService.start(level);

      this.started = true;
      this.grid = this.minesweeperService.grid;
    } finally {
      this.spinnerService.stop();
    }
  }
}
