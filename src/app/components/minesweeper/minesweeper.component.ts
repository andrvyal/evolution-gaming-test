import { Component, OnInit } from '@angular/core';

import { environment } from '../../../environments/environment';
import { MinesweeperService } from '../../services/minesweeper.service';
import { SpinnerService } from '../../services/spinner.service';

@Component({
  selector: 'egt-minesweeper',
  templateUrl: './minesweeper.component.html',
  styleUrls: ['./minesweeper.component.scss']
})
export class MinesweeperComponent implements OnInit {

  grid: Array<Array<string>>;
  levels: Array<number>;
  lose =  false;
  ready = false;
  started = false;

  constructor(
    private minesweeperService: MinesweeperService,
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

  async open(row: number, col: number): Promise<void> {
    this.spinnerService.start();

    try {
      const sussess: boolean = await this.minesweeperService.open(row, col);
      this.grid = this.minesweeperService.grid;

      if (!sussess) {
        this.lose = true;
        alert('You lose');
      }
    } finally {
      this.spinnerService.stop();
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
