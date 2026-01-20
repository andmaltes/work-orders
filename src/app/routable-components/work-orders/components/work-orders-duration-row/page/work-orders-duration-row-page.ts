import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { WorkOrdersDurationRow } from "../component/work-orders-duration-row";
import { map, Observable } from "rxjs";
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
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class WorkOrdersDurationRowPage  implements  OnInit {
    @Input({ required: true }) workCenterId!: string;
    @Input({ required: true }) workOrders: WorkOrderDocumentWithIntervals[] = [];
    intervals$: Observable<Interval[]>;


    constructor(private timelineStateService: TimelineStateService,
                private createEditWorkOrderModalServiceService: CreateEditWorkOrderModalServiceService) {
        this.intervals$ = this.timelineStateService.intervals$;
    }
    ngOnInit():void {

    }


    edit(workorder: WorkOrderDocument): void {
        this.createEditWorkOrderModalServiceService.open(workorder.data.workCenterId, workorder.docId);
    }

    delete(workorder: WorkOrderDocument): void {
        this.timelineStateService.deleteWorkOrder(workorder.docId);
    }

    openCreateNewOrder(dateIndex: number): void {
        const date = this.timelineStateService.snapshot.intervals.at(dateIndex);
        this.createEditWorkOrderModalServiceService.open(this.workCenterId, undefined, date?.intervalId);
    }
}
