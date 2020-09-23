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

  isFlagged(rowIndex: number, colIndex: number): boolean {
    return this.minesweeperService.isFlagged(rowIndex, colIndex);
  }

  isMine(rowIndex: number, colIndex: number): boolean {
    return this.minesweeperService.isMine(rowIndex, colIndex);
  }

  isOpen(rowIndex: number, colIndex: number): boolean {
    return this.minesweeperService.isOpen(rowIndex, colIndex);
  }

  isUnknown(rowIndex: number, colIndex: number): boolean {
    return this.minesweeperService.isUnknown(rowIndex, colIndex);
  }

  open(rowIndex: number, colIndex: number): void {
    if (this.isUnknown(rowIndex, colIndex)) {
      this.cellOpen.emit([rowIndex, colIndex]);
    }
  }

  toggleFlag(event: MouseEvent, rowIndex: number, colIndex: number): void {
    if (event.button === 2) { // check if right button
      event.preventDefault();
      this.minesweeperService.toggleFlag(rowIndex, colIndex);
    }
  }
}
