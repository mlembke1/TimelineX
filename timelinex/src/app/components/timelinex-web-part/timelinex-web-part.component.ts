import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-timelinex-web-part',
  templateUrl: './timelinex-web-part.component.html',
  styleUrls: ['./timelinex-web-part.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})
export class TimelinexWebPartComponent implements OnInit {

  calendarURLInput: string = '';

  constructor() { }

  ngOnInit() {
  }

  addCalendar = () => {
    // Call service here with this.calendarURLInput;
  }

}
