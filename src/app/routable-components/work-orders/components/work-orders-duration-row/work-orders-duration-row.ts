import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { Observable } from "rxjs";
import { TimelineStateService } from "../../services/timeline-state.service";
import { AsyncPipe, NgForOf, NgIf } from "@angular/common";
import { WorkOrderDocument, WorkOrderDocumentWithIntervals } from "../../model/work-order.interface";
import { NgbDropdown, NgbDropdownItem, NgbDropdownMenu, NgbDropdownToggle } from "@ng-bootstrap/ng-bootstrap";
import { Interval } from "../../model/timeline.state";
import { WorkOrderStatusBadge } from "../../../../shared-components/work-order-status-badge/work-order-status-badge";
import { CreateEditWorkOrderModalServiceService } from "../../services/create-edit-work-order-modal-service.service";

@Component({
    selector: 'app-work-orders-duration-row',
    imports: [
        NgForOf,
        AsyncPipe,
        NgIf,
        NgbDropdown,
        NgbDropdownToggle,
        NgbDropdownMenu,
        NgbDropdownItem,
        WorkOrderStatusBadge
    ],
    templateUrl: './work-orders-duration-row.html',
    styleUrl: './work-orders-duration-row.scss',
    encapsulation: ViewEncapsulation.None
})
export class WorkOrdersDurationRow implements OnInit {
    @Input() workCenterId: string = '';

    workOrders$!: Observable<WorkOrderDocumentWithIntervals[]>;
    intervals$!: Observable<Interval[]>;

    // As per designs, every interval column is 130px wide
    private readonly INTERVAL_WIDTH = 130;

    constructor(private timelineStateService: TimelineStateService, private createEditWorkOrderModalServiceService:CreateEditWorkOrderModalServiceService) {
    }

    ngOnInit(): void {
        this.workOrders$ = this.timelineStateService.getWorkOrdersForWorkCenterWithIntervals(this.workCenterId);
        this.intervals$ = this.timelineStateService.intervals$;
    }

    /* This method calculates the width of the work order duration as follows:
    * 1. The total number of intervals multiplied by the interval width
    * 2. Subtract the percentage of the first and the last interval that is not beign shown.
    *    This happens when the total duration is not totally covering the interval. For intance,
    *    when the order dates are Jan 13 to Feb 20, and we are in the montly view, the bar is not fully
    *    covering Jan and Feb
    * */
    calculateWidth(workorder: WorkOrderDocumentWithIntervals): number {
        if (!workorder.numberOfIntervals) {
            return 0;
        }

        let totalIntervalsWidth = workorder.numberOfIntervals * this.INTERVAL_WIDTH;

        if(workorder.firstIntervalPercentage !== 1) {
            totalIntervalsWidth=totalIntervalsWidth-  (1 - (workorder.firstIntervalPercentage || 0))  * this.INTERVAL_WIDTH;
        }

        if(workorder.lastIntervalPercentage !== 0) {
            totalIntervalsWidth=totalIntervalsWidth-  (1 - (workorder.lastIntervalPercentage || 0)) * this.INTERVAL_WIDTH;
        }


        return totalIntervalsWidth ;
    }

    // When the duration is not totally covering the interval, this method calculates the left position of the bar
    calculateLeft(workorder: WorkOrderDocumentWithIntervals): number {
        return  (1 - (workorder.firstIntervalPercentage || 0))  * this.INTERVAL_WIDTH;
    }

    edit(workorder:WorkOrderDocument):void{
        this.createEditWorkOrderModalServiceService.open(workorder.data.workCenterId,workorder.docId);
    }
    delete(workorder:WorkOrderDocument):void{
        this.timelineStateService.deleteWorkOrder(workorder.docId);
    }
}