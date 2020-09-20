import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { MinesweeperService } from '../../services/minesweeper.service';

@Component({
  selector: 'egt-minesweeper-grid',
  templateUrl: './minesweeper-grid.component.html',
  styleUrls: ['./minesweeper-grid.component.scss']
})
export class MinesweeperGridComponent implements OnInit {
  @Input() disabled: boolean;
  @Input() grid: Array<Array<string>>;

  @Output() cellOpen: EventEmitter<Array<number>> = new EventEmitter<Array<number>>();

  constructor(
    private minesweeperService: MinesweeperService,
  ) { }

  ngOnInit(): void {
  }

  isClosed(cell): boolean {
    return this.minesweeperService.isClosed(cell);
  }

  isMine(cell): boolean {
    return this.minesweeperService.isMine(cell);
  }

  open(row: number, col: number): void {
    const cell: string = this.grid[row][col];

    if (this.isClosed(cell)) {
      this.cellOpen.emit([row, col]);
    }
  }
}
