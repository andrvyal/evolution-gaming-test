import { Injectable } from '@angular/core';

import { MinesweeperCellCoordinates, MinesweeperCellGroup } from '../helpers/minesweeper';
import { MinesweeperService } from './minesweeper.service';

@Injectable({
  providedIn: 'root'
})
export class MinesweeperBotService {

  constructor(
    private minesweeperService: MinesweeperService,
  ) { }

  private getFlagsAround(originRowIndex: number, originColIndex: number): number {
    let flagsAround = 0;

    this.minesweeperService.forEachAround(originRowIndex, originColIndex, (rowIndex, colIndex) => {
        if (this.minesweeperService.isFlagged(rowIndex, colIndex)) {
          ++flagsAround;
        }
    });

    return flagsAround;
  }

  private getNextToOpen(): MinesweeperCellCoordinates {
    let selected: MinesweeperCellCoordinates;

    this.minesweeperService.forEach((rowIndex: number, colIndex: number) => {
      if (selected) {
        return;
      }

      if (this.minesweeperService.isOpen(rowIndex, colIndex)) {
        const mines: number = this.minesweeperService.getValue(rowIndex, colIndex);

        if (!mines) {
          return;
        }

        const unknownAround: Array<MinesweeperCellCoordinates> = this.getUnknownAround(rowIndex, colIndex);

        if (unknownAround.length) {
          const flagsAround: number = this.getFlagsAround(rowIndex, colIndex);

          if (flagsAround === mines) {
            selected = unknownAround[0];
          }
        }
      }
    });

    if (!selected) {
      const groups: Array<MinesweeperCellGroup> = [];

      this.minesweeperService.forEach((rowIndex: number, colIndex: number) => {
        if (this.minesweeperService.isOpen(rowIndex, colIndex)) {
          const mines: number = this.minesweeperService.getValue(rowIndex, colIndex);

          if (!mines) {
            return;
          }

          const unknownAround: Array<MinesweeperCellCoordinates> = this.getUnknownAround(rowIndex, colIndex);

          if (unknownAround.length) {
            const flagsAround: number = this.getFlagsAround(rowIndex, colIndex);
            const unknownMines: number = mines - flagsAround;

            if (unknownMines) {
              groups.push({
                cells: unknownAround,
                mines: unknownMines,
              });
            }
          }
        }
      });

      for (const group1 of groups) {
        if (selected) {
          break;
        }

        for (const group2 of groups) {
          if (this.isGroupEqual(group1, group2)) {
            continue;
          }

          if (this.isGroupParentChild(group1, group2)) {
            const difference: MinesweeperCellGroup = this.subtractGroup(group1, group2);

            if (difference.mines === 0) {
              selected = difference.cells[0];
              break;
            }
          }
        }
      }
    }

    if (!selected) {
      this.minesweeperService.forEach((rowIndex: number, colIndex: number) => {
        if (selected) {
          return;
        }

        if (this.minesweeperService.isOpen(rowIndex, colIndex)) {
          const unknownAround: Array<MinesweeperCellCoordinates> = this.getUnknownAround(rowIndex, colIndex);

          if (unknownAround.length) {
            const index: number = Math.floor(Math.random() * unknownAround.length);
            selected = unknownAround[index];
          }
        }
      });
    }

    if (!selected) {
      const unknown: Array<MinesweeperCellCoordinates> = this.getUnknown();
      const index: number = Math.floor(Math.random() * unknown.length);

      selected = unknown[index];
    }

    return selected;
  }

  private getUnknown(): Array<MinesweeperCellCoordinates> {
    const unknown: Array<MinesweeperCellCoordinates> = [];

    this.minesweeperService.forEach((rowIndex: number, colIndex: number) => {
      if (this.minesweeperService.isUnknown(rowIndex, colIndex)) {
        unknown.push({
          rowIndex,
          colIndex,
        });
      }
    });

    return unknown;
  }

  private getUnknownAround(originRowIndex: number, originColIndex: number): Array<MinesweeperCellCoordinates> {
    const unknownNeighbors: Array<MinesweeperCellCoordinates> = [];

    this.minesweeperService.forEachAround(originRowIndex, originColIndex, (rowIndex, colIndex) => {
      if (this.minesweeperService.isUnknown(rowIndex, colIndex)) {
        unknownNeighbors.push({
          rowIndex,
          colIndex,
        });
      }
    });

    return unknownNeighbors;
  }

  private hasCell(cells: Array<MinesweeperCellCoordinates>, targetCell: MinesweeperCellCoordinates): boolean {
    for (const cell of cells) {
      if (this.isCellEqual(cell, targetCell)) {
        return true;
      }
    }

    return false;
  }

  private isCellEqual(cell1: MinesweeperCellCoordinates, cell2: MinesweeperCellCoordinates): boolean {
    return (
      cell1.rowIndex === cell2.rowIndex &&
      cell1.colIndex === cell2.colIndex
    );
  }

  private isGroupEqual(group1: MinesweeperCellGroup, group2: MinesweeperCellGroup): boolean {
    if (group1.cells.length !== group1.cells.length) {
      return false;
    }

    for (const cell of group1.cells) {
      if (!this.hasCell(group2.cells, cell)) {
        return false;
      }
    }

    return true;
  }

  private isGroupParentChild(parent: MinesweeperCellGroup, child: MinesweeperCellGroup): boolean {
    if (parent.cells.length <= child.cells.length) {
      return false;
    }

    for (const cell of child.cells) {
      if (!this.hasCell(parent.cells, cell)) {
        return false;
      }
    }

    return true;
  }

  nextMove(): MinesweeperCellCoordinates {
    let flagsSet: boolean;

    do {
      flagsSet = this.setFlags();
    } while (flagsSet);

    const nextCell: MinesweeperCellCoordinates = this.getNextToOpen();

    return nextCell;
  }

  private setFlags(): boolean {
    let flagsSet = false;

    this.minesweeperService.forEach((rowIndex: number, colIndex: number) => {
      if (this.minesweeperService.isOpen(rowIndex, colIndex)) {
        const mines: number = this.minesweeperService.getValue(rowIndex, colIndex);

        if (!mines) {
          return;
        }

        const unknownAround: Array<MinesweeperCellCoordinates> = this.getUnknownAround(rowIndex, colIndex);

        if (unknownAround.length) {
          const flagsAround: number = this.getFlagsAround(rowIndex, colIndex);
          const unknownMines: number = mines - flagsAround;

          if (unknownMines) {
            if (unknownAround.length === unknownMines) {
              for (const cell of unknownAround) {
                if (!this.minesweeperService.isFlagged(cell.rowIndex, cell.colIndex)) {
                  this.minesweeperService.toggleFlag(cell.rowIndex, cell.colIndex);
                  flagsSet = true;
                }
              }
            }
          }
        }
      }
    });

    const groups: Array<MinesweeperCellGroup> = [];

    this.minesweeperService.forEach((rowIndex: number, colIndex: number) => {
      if (this.minesweeperService.isOpen(rowIndex, colIndex)) {
        const mines: number = this.minesweeperService.getValue(rowIndex, colIndex);

        if (!mines) {
          return;
        }

        const unknownAround: Array<MinesweeperCellCoordinates> = this.getUnknownAround(rowIndex, colIndex);

        if (unknownAround.length) {
          const flagsAround: number = this.getFlagsAround(rowIndex, colIndex);
          const unknownMines: number = mines - flagsAround;

          if (unknownMines) {
            groups.push({
              cells: unknownAround,
              mines: unknownMines,
            });
          }
        }
      }
    });

    for (const group1 of groups) {
      for (const group2 of groups) {
        if (this.isGroupParentChild(group1, group2)) {
          const difference: MinesweeperCellGroup = this.subtractGroup(group1, group2);

          if (difference.mines === difference.cells.length) {
            for (const cell of difference.cells) {
              if (!this.minesweeperService.isFlagged(cell.rowIndex, cell.colIndex)) {
                this.minesweeperService.toggleFlag(cell.rowIndex, cell.colIndex);
                flagsSet = true;
              }
            }
          }
        }
      }
    }

    return flagsSet;
  }

  private subtractGroup(from: MinesweeperCellGroup, minus: MinesweeperCellGroup): MinesweeperCellGroup {
    const difference: MinesweeperCellGroup = {
      cells: [],
      mines: from.mines - minus.mines,
    };

    for (const cell of from.cells) {
      if (!this.hasCell(minus.cells, cell)) {
        difference.cells.push(cell);
      }
    }

    return difference;
  }
}
