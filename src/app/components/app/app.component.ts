import { Component, OnInit } from '@angular/core';

import { SpinnerService } from '../../services/spinner.service';

@Component({
  selector: 'egt-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  spinner = false;

  constructor(
    private spinnerService: SpinnerService,
  ) { }

  ngOnInit(): void {
    this.spinnerService.stateChange.subscribe((state: boolean) => {
        setTimeout(() => {
            this.spinner = state;
        });
    });
  }
}
