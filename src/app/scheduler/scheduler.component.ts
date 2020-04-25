import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {DayPilot, DayPilotSchedulerComponent} from 'daypilot-pro-angular';
import {DataService} from './data.service';

@Component({
  selector: 'app-scheduler-component',
  template: `
    <daypilot-scheduler [config]="config" [events]="events" #scheduler></daypilot-scheduler>`,
  styles: [``]
})
export class SchedulerComponent implements AfterViewInit {

  @ViewChild('scheduler', {static: false})
  scheduler: DayPilotSchedulerComponent;

  events: any[] = [];

  config: DayPilot.SchedulerConfig = {
    timeHeaders: [{groupBy: 'Month'}, {groupBy: 'Day', format: 'd'}],
    scale: 'Day',
    startDate: '2020-02-01',
    days: 29,
    treeEnabled: true,
    onTimeRangeSelected: args => {
      const dp = this.scheduler.control;
      DayPilot.Modal.prompt('Create a new event:', 'Event 1').then(modal => {
        dp.clearSelection();
        if (modal.canceled) {
          return;
        }
        dp.events.add({
          start: args.start,
          end: args.end,
          id: DayPilot.guid(),
          resource: args.resource,
          text: modal.result
        });
      });
    },
  };

  constructor(private ds: DataService) {
  }

  ngAfterViewInit(): void {
    this.ds.getResources().subscribe(result => this.config.resources = result);

    const from = this.scheduler.control.visibleStart();
    const to = this.scheduler.control.visibleEnd();
    this.ds.getEvents(from, to).subscribe(result => {
      this.events = result;
    });
  }

}

