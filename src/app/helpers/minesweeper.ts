export enum MinesweeperCell {
  Closed = '□',
  Mine = '*',
}

export interface MinesweeperCellCoordinates {
  colIndex: number;
  rowIndex: number;
}

export interface MinesweeperCellGroup {
  cells: Array<MinesweeperCellCoordinates>;
  mines: number;
  source?: MinesweeperCellCoordinates;
  operator?: string;
  operatorGroups?: Array<MinesweeperCellGroup>;
}

export enum MinesweeperCommand {
  Map = 'map',
  New = 'new',
  Open = 'open',
}

export enum MinesweeperStatus {
  Lose = 'You lose',
  Ok = 'OK',
  Win = 'You win',
}

export function isCoordinatesEqual(point1: MinesweeperCellCoordinates, point2: MinesweeperCellCoordinates): boolean {
  const equal: boolean = (
    point1.rowIndex === point2.rowIndex &&
    point1.colIndex === point2.colIndex
  );

  return equal;
}
