import {
    AfterViewInit,
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    Input,
    OnDestroy,
    OnInit,
    ViewChild
} from '@angular/core';
import { combineLatest, map, Observable, tap } from "rxjs";
import { AsyncPipe, NgForOf, NgIf, NgSwitch, Time } from "@angular/common";
import moment, { Moment } from 'moment';
import { WorkOrdersDurationRow } from "../../work-orders-duration-row/component/work-orders-duration-row";
import { WorkOrdersDurationRowPage } from "../../work-orders-duration-row/page/work-orders-duration-row-page";
import { WorkCenterDocument } from "../../../model/work-center.interface";
import { Interval } from "../../../model/timeline.state";
import { TimelineStateService } from "../../../services/timeline-state.service";
import { TimelineScrollService } from "../../../services/timeline-scroll.service";
import { WorkOrderDocumentWithIntervals } from "../../../model/work-order.interface";

@Component({
    selector: 'app-work-orders-table',
    imports: [
        NgForOf,
        WorkOrdersDurationRow,
        NgIf,
        WorkOrdersDurationRowPage,
        WorkOrdersDurationRow
    ],
    templateUrl: './work-orders-table.html',
    styleUrl: './work-orders-table.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class WorkOrdersTable implements AfterViewInit, OnDestroy {
    @Input({ required: true }) workCenters: WorkCenterDocument[] = [];
    @Input({ required: true }) intervals: Interval[] = [];
    @Input({ required: true })  workOrders: {[workCenterId: string]: WorkOrderDocumentWithIntervals[]} = {};

    @ViewChild('scrollContainer') scrollContainer!: ElementRef<HTMLDivElement>;
    @ViewChild('scrollSentinelLeft') scrollSentinelLeft!: ElementRef<HTMLDivElement>;
    @ViewChild('scrollSentinelRight') scrollSentinelRight!: ElementRef<HTMLDivElement>;

    private observer?: IntersectionObserver;

    constructor(private timelineStateService: TimelineStateService, private timelineScrollService: TimelineScrollService) {
    }

    trackByInterval(index: number, interval: Interval): number {
        return interval.intervalId;
    }

    trackByWorkCenter(index: number, workCenter: WorkCenterDocument): string {
        return workCenter.docId;
    }

    ngAfterViewInit(): void {

        // Listen for scroll requests from anywhere in the app
        this.timelineScrollService.scrollRequest$.subscribe(() => {
                this.scrollToToday();
            }
        );

        // Initial scroll
       this.scrollToToday();

        // enable horizontal infinite scroll when initial scroll is completed
        setTimeout(() => this.setupHorizontalInfiniteScroll(), 500);

    }

    scrollToToday(): void {
        const container = this.scrollContainer?.nativeElement;
        if (!container) return;

        const todayElement = container.querySelector('.work-orders-table-header-current-badge') as HTMLElement;
        const sidePanel = container.querySelector('.work-center') as HTMLElement;

        if (todayElement && sidePanel) {
            const sidePanelWidth = sidePanel.offsetWidth;
            const containerWidth = container.offsetWidth;

            // get positions relative to the viewport
            const elementRect = todayElement.getBoundingClientRect();
            const containerRect = container.getBoundingClientRect();

            // calculate the "absolute" left position of the element within the scrollable track
            // (Current relative position + current scroll amount)
            const absoluteElementLeft = elementRect.left - containerRect.left + container.scrollLeft;

            // calculate visible area (Total width minus the sticky side panel)
            const visibleWidth = containerWidth - sidePanelWidth;

            // target: Move element so its center aligns with the center of the visible area
            // We add sidePanelWidth at the end because the scroll track effectively "starts" after the side panel visually
            const targetScroll = absoluteElementLeft - sidePanelWidth - (visibleWidth / 2) + (todayElement.offsetWidth / 2);

            container.scrollTo({
                left: Math.max(0, targetScroll),
                behavior: 'smooth'
            });
        }
    }

    private setupHorizontalInfiniteScroll() {
        const options = {
            root: this.scrollContainer.nativeElement,
            threshold: 0.1,
            rootMargin: '0px 0px 0px -380px'
        };

        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    if (entry.target === this.scrollSentinelLeft.nativeElement) {
                        this.loadPreviousDates();
                    } else if (entry.target === this.scrollSentinelRight.nativeElement) {
                        this.loadFutureDates();
                    }
                }
            });
        }, options);

        this.observer.observe(this.scrollSentinelLeft.nativeElement);
        this.observer.observe(this.scrollSentinelRight.nativeElement);
    }

    private loadPreviousDates() {
        const container = this.scrollContainer.nativeElement;

        // capture the scroll width before adding data
        const previousScrollWidth = container.scrollWidth;
        const previousScrollLeft = container.scrollLeft;

        // logic to prepend dates to your 'intervals' array
        this.timelineStateService.increaseViewPoint('past');

        // wait for Angular to render the new elements
        setTimeout(() => {
            // Calculate the difference in width
            const newScrollWidth = container.scrollWidth;
            const widthAdded = newScrollWidth - previousScrollWidth;

            // Adjust the scroll position so the view remains "stationary"
            container.scrollLeft = previousScrollLeft + widthAdded + 1;
        }, 0);
    }

    private loadFutureDates() {
        this.timelineStateService.increaseViewPoint('future');
    }

    ngOnDestroy() {
        this.observer?.disconnect();
    }

}
