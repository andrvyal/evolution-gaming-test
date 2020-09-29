import { TestBed } from '@angular/core/testing';

import { MinesweeperBotService } from './minesweeper-bot.service';

describe('MinesweeperBotService', () => {
  let service: MinesweeperBotService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MinesweeperBotService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
