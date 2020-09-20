import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './components/app/app.component';
import { MinesweeperComponent } from './components/minesweeper/minesweeper.component';
import { SpinnerComponent } from './components/spinner/spinner.component';
import { MinesweeperGridComponent } from './components/minesweeper-grid/minesweeper-grid.component';

@NgModule({
  declarations: [
    AppComponent,
    MinesweeperComponent,
    SpinnerComponent,
    MinesweeperGridComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
