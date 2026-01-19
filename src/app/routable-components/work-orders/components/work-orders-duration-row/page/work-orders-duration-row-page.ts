import { Component, Input, OnInit } from '@angular/core';
import { WorkOrdersDurationRow } from "../component/work-orders-duration-row";
import { Observable } from "rxjs";
import { Interval } from "../../../model/timeline.state";
import { WorkOrderDocument, WorkOrderDocumentWithIntervals } from "../../../model/work-order.interface";
import { TimelineStateService } from "../../../services/timeline-state.service";
import { CreateEditWorkOrderModalServiceService } from "../../../services/create-edit-work-order-modal-service.service";
import { AsyncPipe } from "@angular/common";

@Component({
    selector: 'app-work-orders-duration-row-page',
    imports: [
        WorkOrdersDurationRow,
        AsyncPipe
    ],
    templateUrl: './work-orders-duration-row-page.html',
    styleUrl: './work-orders-duration-row-page.scss',
})
export class WorkOrdersDurationRowPage {
    @Input({ required: true })
    set workCenterId(id: string) {
        this._workCenterId = id;
        this.workOrders$ =
            this.timelineStateService.getWorkOrdersForWorkCenterWithIntervals(id);
    }

    workOrders$!: Observable<WorkOrderDocumentWithIntervals[]>;
    intervals$: Observable<Interval[]>;

    private _workCenterId!: string;

    constructor(private timelineStateService: TimelineStateService, private createEditWorkOrderModalServiceService: CreateEditWorkOrderModalServiceService) {
        this.intervals$ = this.timelineStateService.intervals$;
    }


    edit(workorder: WorkOrderDocument): void {
        this.createEditWorkOrderModalServiceService.open(workorder.data.workCenterId, workorder.docId);
    }

    delete(workorder: WorkOrderDocument): void {
        this.timelineStateService.deleteWorkOrder(workorder.docId);
    }

    openCreateNewOrder(dateIndex: number): void {
        const date = this.timelineStateService.snapshot.intervals.at(dateIndex);
        this.createEditWorkOrderModalServiceService.open(this._workCenterId, undefined, date?.intervalId);
    }
}
