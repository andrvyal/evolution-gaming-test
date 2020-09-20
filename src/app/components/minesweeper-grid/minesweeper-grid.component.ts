import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'egt-minesweeper-grid',
  templateUrl: './minesweeper-grid.component.html',
  styleUrls: ['./minesweeper-grid.component.scss']
})
export class MinesweeperGridComponent implements OnInit {
  @Input() disabled: boolean;
  @Input() grid: Array<Array<string>>;

  @Output() cellOpen: EventEmitter<Array<number>> = new EventEmitter<Array<number>>();

  constructor() { }

  ngOnInit(): void {
  }

  open(row: number, col: number): void {
    this.cellOpen.emit([row, col]);
  }
}
