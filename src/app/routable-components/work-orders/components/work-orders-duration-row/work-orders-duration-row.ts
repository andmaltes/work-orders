import { Component, Input, OnInit } from '@angular/core';
import { Observable, tap } from "rxjs";
import { map } from "rxjs/operators";
import moment from 'moment';
import { TimelineStateService } from "../../services/timeline-state.service";
import { AsyncPipe, JsonPipe, NgForOf, NgIf } from "@angular/common";
import { WorkOrderDocument, WorkOrderDocumentWithIntervals } from "../../model/work-order.interface";

@Component({
    selector: 'app-work-orders-duration-row',
    imports: [
        NgForOf,
        AsyncPipe,
        JsonPipe,
        NgIf
    ],
    templateUrl: './work-orders-duration-row.html',
    styleUrl: './work-orders-duration-row.scss',
})
export class WorkOrdersDurationRow implements OnInit {

    @Input() workCenterId: string = '';
    workOrders$: Observable<WorkOrderDocumentWithIntervals[]> | undefined;
    intervals$: Observable<string[]> | undefined;
    private readonly INTERVAL_WIDTH = 130;

    constructor(private timelineStateService: TimelineStateService) {
    }

    ngOnInit(): void {
        this.workOrders$ = this.timelineStateService.getWorkOrdersForWorkCenterWithIntervals(this.workCenterId);

        this.intervals$ = this.timelineStateService.intervals$;
    }

    calculateLeft(workorder: WorkOrderDocumentWithIntervals, intervals: string[]): number {
        const index = intervals.indexOf(workorder.firstIntervalId!);
        if (index === -1) return 0;

        const firstIntervalOffset = (100 - (workorder.firstIntervalPercentage || 0)) / 100 * this.INTERVAL_WIDTH;
        return (index * this.INTERVAL_WIDTH) + firstIntervalOffset;
    }

    calculateWidth(workorder: WorkOrderDocumentWithIntervals): number {
        if (!workorder.numberOfIntervals) return 0;

        const totalIntervalsWidth = workorder.numberOfIntervals * this.INTERVAL_WIDTH;
        const firstIntervalUnused = (100 - (workorder.firstIntervalPercentage || 0)) / 100 * this.INTERVAL_WIDTH;
        const lastIntervalUnused = (100 - (workorder.lastIntervalPercentage || 0)) / 100 * this.INTERVAL_WIDTH;

        return totalIntervalsWidth - firstIntervalUnused - lastIntervalUnused;
    }
}
