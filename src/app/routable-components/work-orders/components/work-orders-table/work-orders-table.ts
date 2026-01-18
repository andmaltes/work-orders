import { Component, OnInit } from '@angular/core';
import { TimelineStateService } from "../../services/timeline-state.service";
import { combineLatest, map, Observable } from "rxjs";
import { AsyncPipe, NgForOf, NgIf, NgSwitch, Time } from "@angular/common";
import { WorkOrdersDurationRow } from "../work-orders-duration-row/work-orders-duration-row";
import { WorkCenterDocument } from "../../model/work-center.interface";
import moment, { Moment } from 'moment';
import { Interval, Timescale } from "../../model/timeline.state";

@Component({
    selector: 'app-work-orders-table',
    imports: [
        AsyncPipe,
        NgForOf,
        WorkOrdersDurationRow,
        NgIf,
        NgSwitch
    ],
    templateUrl: './work-orders-table.html',
    styleUrl: './work-orders-table.scss',
})
export class WorkOrdersTable implements OnInit {
    workCenters$!: Observable<WorkCenterDocument[]>;
    intervals$!: Observable<Interval[]>;

    constructor(private timelineStateService: TimelineStateService) {
    }

    ngOnInit() {
        this.workCenters$ = this.timelineStateService.workCenters$;
        this.intervals$ = combineLatest([this.timelineStateService.intervals$, this.timelineStateService.timescale$]).pipe(
            map(([intervals, timescale]: [Interval[], Timescale]) => intervals.map((interval: Interval) => {
                const momentDate: Moment = moment(interval.intervalId);
                let formattedName;
                // format interval for headers
                switch (timescale) {
                    case 'day':
                        formattedName= momentDate.format('MMM D, YYYY');
                        break;
                    case 'week':
                        formattedName= momentDate.format('MMM D, YYYY');
                        break;
                    case 'month':
                        formattedName= momentDate.format('MMM YYYY');
                        break;
                }

                return { ...interval, formattedName, timescale };
            }))
        );
    }
}
