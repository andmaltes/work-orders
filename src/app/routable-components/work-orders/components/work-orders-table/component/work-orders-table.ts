import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { combineLatest, map, Observable, tap } from "rxjs";
import { AsyncPipe, NgForOf, NgIf, NgSwitch, Time } from "@angular/common";
import moment, { Moment } from 'moment';
import { WorkOrdersDurationRow } from "../../work-orders-duration-row/component/work-orders-duration-row";
import { WorkOrdersDurationRowPage } from "../../work-orders-duration-row/page/work-orders-duration-row-page";
import { WorkCenterDocument } from "../../../model/work-center.interface";
import { Interval } from "../../../model/timeline.state";

@Component({
    selector: 'app-work-orders-table',
    imports: [
        AsyncPipe,
        NgForOf,
        WorkOrdersDurationRow,
        NgIf,
        WorkOrdersDurationRowPage,
        WorkOrdersDurationRow
    ],
    templateUrl: './work-orders-table.html',
    styleUrl: './work-orders-table.scss',
})
export class WorkOrdersTable implements AfterViewInit {
    @Input() workCenters: WorkCenterDocument[]=[];
    @Input() intervals: Interval[]=[];

    @ViewChild('scrollContainer') scrollContainer!: ElementRef<HTMLDivElement>;

    ngAfterViewInit(): void {
        this.scrollToToday();
    }
     scrollToToday() {
        const container = this.scrollContainer?.nativeElement;
        if (!container) return;

        const todayElement = container.querySelector('.work-orders-table-header-current-badge');
        if (todayElement) {
            todayElement.scrollIntoView({
                behavior: 'smooth',
                inline: 'center',
                block: 'nearest'
            });
        }
    }
}
