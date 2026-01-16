import { Component, OnInit } from '@angular/core';
import { TimelineStateService } from "../../services/timeline-state.service";
import { Observable } from "rxjs";
import { AsyncPipe, NgForOf } from "@angular/common";
import { WorkOrdersDurationRow } from "../work-orders-duration-row/work-orders-duration-row";
import { WorkCenterDocument } from "../../model/work-center.interface";

@Component({
    selector: 'app-work-orders-table',
    imports: [
        AsyncPipe,
        NgForOf,
        WorkOrdersDurationRow
    ],
    templateUrl: './work-orders-table.html',
    styleUrl: './work-orders-table.scss',
})
export class WorkOrdersTable {
    workCenters$: Observable<WorkCenterDocument[]>;

    constructor(private timelineStateService: TimelineStateService) {
        this.workCenters$ = this.timelineStateService.workCenters$;
    }

}
