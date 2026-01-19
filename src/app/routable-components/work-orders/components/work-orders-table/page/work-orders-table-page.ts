import { Component } from '@angular/core';
import { combineLatest, map, Observable, tap } from "rxjs";
import { Interval, Timescale } from "../../../model/timeline.state";
import { WorkCenterDocument } from "../../../model/work-center.interface";
import moment, { Moment } from "moment/moment";
import { TimelineStateService } from "../../../services/timeline-state.service";
import { WorkOrdersTable } from "../component/work-orders-table";
import { AsyncPipe, NgIf } from "@angular/common";
import { WorkOrderDocumentWithIntervals } from "../../../model/work-order.interface";

@Component({
    selector: 'app-work-orders-table-page',
    imports: [
        WorkOrdersTable,
        AsyncPipe,
        NgIf
    ],
    templateUrl: './work-orders-table-page.html',
    styleUrl: './work-orders-table-page.scss',
})
export class WorkOrdersTablePage {
    workCenters$: Observable<WorkCenterDocument[]>;
    workOrders$: Observable<{[workCenterId: string]: WorkOrderDocumentWithIntervals[]}>;
    intervals$: Observable<Interval[]>;

    constructor(private timelineStateService: TimelineStateService) {
        this.workCenters$ = this.timelineStateService.workCenters$;
        this.intervals$ = combineLatest([this.timelineStateService.intervals$, this.timelineStateService.timescale$]).pipe(
            map(([intervals, timescale]: [Interval[], Timescale]) => this.transformIntervals(intervals, timescale)),
        );
        this.workOrders$ = this.timelineStateService.getWorkOrdersByWorkCenterWithIntervals();
    }

    transformIntervals(intervals: Interval[], timescale: Timescale) {
        return intervals.map((interval: Interval) => {
                const momentDate: Moment = moment(interval.intervalId);
                let formattedName;
                // format interval for headers
                switch (timescale) {
                    case 'day':
                        formattedName = momentDate.format('MMM D, YYYY');
                        break;
                    case 'week':
                        formattedName = momentDate.format('MMM D, YYYY');
                        break;
                    case 'month':
                        formattedName = momentDate.format('MMM YYYY');
                        break;
                }

                return { ...interval, formattedName, timescale };
            }
        );
    }
}
