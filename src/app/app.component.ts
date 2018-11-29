import { Component, OnInit, ChangeDetectionStrategy, ViewChild, TemplateRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import {
  isSameDay,
  isSameMonth,
} from 'date-fns';

import { Subject } from 'rxjs';
import {
  CalendarEvent,
  CalendarView
} from 'angular-calendar';

const colors: any = {
  red: {
    primary: '#ad2121',
    secondary: '#FAE3E3'
  },
  blue: {
    primary: '#1e90ff',
    secondary: '#D1E8FF'
  },
  yellow: {
    primary: '#e3bc08',
    secondary: '#FDF1BA'
  }
};


@Component({
  selector: 'app-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'angularTask';
  eventForm: FormGroup;
  eventData: CalendarEvent[] = [];
  eventDataJson: string;
  storage: Storage;

  @ViewChild('modalContent')
  modalContent: TemplateRef<any>;

  view: CalendarView = CalendarView.Week;

  CalendarView = CalendarView;

  viewDate: Date = new Date();

  refreshData: Subject<any> = new Subject();

  activeDayIsOpen = true;

  ngOnInit() {
    this.eventForm = new FormGroup({
      'eventTitle': new FormControl(null, Validators.required),
      'eventDescription': new FormControl(null, Validators.required),
      'startTime': new FormControl(null, Validators.required),
      'date': new FormControl({ value: '', disabled: true }, Validators.required),
      'endTime': new FormControl(null, Validators.required),
    });

    this.storage = window.localStorage;
    this.eventDataJson = this.storage.getItem('eventData');
    if (this.eventDataJson) {
      this.eventData = <CalendarEvent[]>JSON.parse(this.eventDataJson);
    } else {
      this.eventData = [];
    }
  }

  constructor() {
    this.eventData = [];
  }

  onAddEvent(): void {
    const eventTitle = this.eventForm.get('eventTitle').value;
    const eventDescription = this.eventForm.get('eventDescription').value;
    const startTime = this.eventForm.get('startTime').value;
    const endTime = this.eventForm.get('endTime').value;
    this.eventData.push({
      title: eventTitle + ' - ' + eventDescription,
      start: startTime,
      end: endTime,
      color: colors.blue,
      draggable: false,
      resizable: {
        beforeStart: false,
        afterEnd: false
      }
    });
    this.refreshData.next();
    this.storage.setItem('eventData', JSON.stringify(this.eventData));
    alert('Event Data added');
    this.eventForm.reset();
  }
}
