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
import {
    NgbDropdown,
    NgbDropdownItem,
    NgbDropdownMenu,
    NgbDropdownToggle,
    NgbTooltip
} from "@ng-bootstrap/ng-bootstrap";
import { WorkOrderDocument, WorkOrderDocumentWithIntervals } from "../../../model/work-order.interface";
import { Interval } from "../../../model/timeline.state";
import { WorkOrderStatusBadge } from "../../../../../shared-components/work-order-status-badge/work-order-status-badge";
import { INTERVAL_WIDTH } from "../../../model/const";
import { WorkOrdersDetails } from "../../work-orders-details/work-orders-details";

@Component({
    selector: 'app-work-orders-duration-row',
    imports: [
        NgForOf,
        NgIf,
        NgbDropdown,
        NgbDropdownToggle,
        NgbDropdownMenu,
        NgbDropdownItem,
        WorkOrderStatusBadge,
        NgbTooltip,
        WorkOrdersDetails
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