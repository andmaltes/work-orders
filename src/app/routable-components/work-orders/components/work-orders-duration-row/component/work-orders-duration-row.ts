import {
    Component,
    ElementRef, EventEmitter,
    HostListener,
    Input,
    OnInit,
    Output,
    ViewChild,
    ViewEncapsulation
} from '@angular/core';
import { Observable } from "rxjs";
import { AsyncPipe, NgForOf, NgIf } from "@angular/common";
import { NgbDropdown, NgbDropdownItem, NgbDropdownMenu, NgbDropdownToggle } from "@ng-bootstrap/ng-bootstrap";
import { WorkOrderDocument, WorkOrderDocumentWithIntervals } from "../../../model/work-order.interface";
import { Interval } from "../../../model/timeline.state";
import { WorkOrderStatusBadge } from "../../../../../shared-components/work-order-status-badge/work-order-status-badge";
import { INTERVAL_WIDTH } from "../../../model/const";

@Component({
    selector: 'app-work-orders-duration-row',
    imports: [
        NgForOf,
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
export class WorkOrdersDurationRow {
    @Input() workCenterId?: string;
    @Input() workOrders: WorkOrderDocumentWithIntervals[] = [];
    @Input() intervals: Interval[] = [];

    @Output() onCreate = new EventEmitter<number>();
    @Output() onEdit = new EventEmitter<WorkOrderDocument>();
    @Output() onDelete = new EventEmitter<WorkOrderDocument>();

    @ViewChild('container') container?: ElementRef<HTMLDivElement>;

    mouseLeftPos = 0;

    onMouseMove(event: MouseEvent) {
        if (this.container) {
            const rect = this.container.nativeElement.getBoundingClientRect();
            // Calculate mouse position relative to the container
            this.mouseLeftPos = event.clientX - rect.left - 62;
        }
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

        let totalIntervalsWidth = workorder.numberOfIntervals * INTERVAL_WIDTH;

        if (workorder.firstIntervalPercentage !== 1) {
            totalIntervalsWidth = totalIntervalsWidth - (1 - (workorder.firstIntervalPercentage || 0)) * INTERVAL_WIDTH;
        }

        if (workorder.lastIntervalPercentage !== 0) {
            totalIntervalsWidth = totalIntervalsWidth - (1 - (workorder.lastIntervalPercentage || 0)) * INTERVAL_WIDTH;
        }


        return totalIntervalsWidth;
    }

    // When the duration is not totally covering the interval, this method calculates the left position of the bar
    calculateLeft(workorder: WorkOrderDocumentWithIntervals): number {
        return (1 - (workorder.firstIntervalPercentage || 0)) * INTERVAL_WIDTH;
    }

    edit(workorder: WorkOrderDocument): void {
        this.onEdit.emit(workorder);
    }

    delete(workorder: WorkOrderDocument): void {
        this.onDelete.emit(workorder);
    }

    openCreateNewOrder(): void {
        const dateIndex = Math.round(this.mouseLeftPos / INTERVAL_WIDTH)
        this.onCreate.emit(dateIndex);
    }
}