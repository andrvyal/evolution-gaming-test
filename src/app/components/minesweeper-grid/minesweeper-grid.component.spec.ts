import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MinesweeperGridComponent } from './minesweeper-grid.component';

describe('MinesweeperGridComponent', () => {
  let component: MinesweeperGridComponent;
  let fixture: ComponentFixture<MinesweeperGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MinesweeperGridComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MinesweeperGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
