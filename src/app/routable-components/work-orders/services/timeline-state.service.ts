import { Injectable } from "@angular/core";
import { BehaviorSubject, map, Observable } from "rxjs";
import moment from 'moment';
import { SAMPLE_WORK_CENTERS } from "../../../mock-data/work-center";
import { SAMPLE_WORK_ORDERS } from "../../../mock-data/work-order";
import { WorkOrderDocument, WorkOrderDocumentWithIntervals } from "../model/work-order.interface";
import { TimelineState, Timescale } from "../model/timeline.state";
import {
    calculateIntervalOverlapForRange,
    calculateIntervals,
    getDateInIntervalId
} from "../utils/date-interval.utils";
import { calculateLeft, calculateWidth } from "../utils/bar-size.utils";
import { INTERVAL_WIDTH } from "../model/const";
import { TimelinePersistanceService } from "./timeline-persistance.service";
import { Time } from "@angular/common";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";


// This service is a simple state management system for the timeline view. It is intented to simulate NgRx's store
// wihtout all the boilerplate.
// In bigger apps, I would use NgRx.
@Injectable({ providedIn: 'root' })
export class TimelineStateService {

    // State
    private readonly state$ = new BehaviorSubject<TimelineState>({
        workCenters: SAMPLE_WORK_CENTERS,
        workOrders: SAMPLE_WORK_ORDERS,
        timescale: 'day',
        intervals: [],
        visibleIntervalsPast: 7,
        visibleIntervalsFuture: 7
    });

    constructor(private timelinePersistanceService: TimelinePersistanceService) {
        // load from local storage or create a new state
        let storeState = this.timelinePersistanceService.loadFromLocalStorage();
        if (storeState) {
            this.patchState(storeState);
            this.setTimescale(storeState.timescale);
        } else {
            this.setTimescale('day');
        }
        // subscribe to state changes and persist them in local storage
        this.state$.pipe(
            takeUntilDestroyed()
        ).subscribe((state: TimelineState) => {
            this.timelinePersistanceService.storeInLocalStorage(state);
        });
    }

    // Current State
    get snapshot(): TimelineState {
        return this.state$.getValue();
    }

    //  Selectors
    readonly workCenters$ = this.state$.pipe(
        map(state => state.workCenters)
    );

    readonly workOrders$ = this.state$.pipe(
        map(state => state.workOrders)
    );


    readonly timescale$ = this.state$.pipe(
        map(state => state.timescale)
    );

    readonly intervals$ = this.state$.pipe(
        map(state => state.intervals)
    );

    getWorkOrdersForWorkCenter$(workCenterId: string): Observable<WorkOrderDocument[]> {
        return this.workOrders$.pipe(map(
            (workOrders: WorkOrderDocument[]) => {
                return workOrders.filter((workOrder: WorkOrderDocument) => workOrder.data.workCenterId === workCenterId)

            }))
    }


    getWorkOrdersForWorkCenterWithIntervals(workCenterId: string): Observable<WorkOrderDocumentWithIntervals[]> {
        return this.state$.pipe(
            map(({ workOrders, timescale, visibleIntervalsPast, visibleIntervalsFuture }: TimelineState) => {
                const today = moment().startOf(timescale);
                const viewStart = today.clone().subtract(visibleIntervalsPast, timescale).startOf(timescale);
                const viewEnd = today.clone().add(visibleIntervalsFuture, timescale).endOf(timescale);
                const orders = this.getWorkOrdersForWorkCenter(workOrders, workCenterId)

                const ordersWithIntervals = orders.map((order: WorkOrderDocument) => this.computeOrderIntervals(order, viewStart, viewEnd, timescale));
                return this.calculateOrderCollitions(ordersWithIntervals, timescale, viewEnd);
            })
        );
    }

    private computeOrderIntervals(order: WorkOrderDocument, viewStart: moment.Moment, viewEnd: moment.Moment, timescale: Timescale): WorkOrderDocumentWithIntervals {

        const startOrderDate = moment(order.data.startDate).startOf('day');
        const endOrderDate = moment(order.data.endDate).endOf('day');

        // Calculate what date to use as start and end date. For intance, if in the view we only have
        // 3 days but the order lasts 15 days, we only show the 3 days that intercect with the visible
        // range
        const startDate = moment.max(startOrderDate, viewStart);
        const endDate = moment.min(endOrderDate, viewEnd);

        // Verify start date and end date makes sense
        if (startDate.isSameOrBefore(endDate, timescale)) {
            // First interval
            // get the id that will match with the interval in the intervals array
            const firstId = getDateInIntervalId(startDate, timescale);

            const {
                intervalCount,
                firstIntervalPercentage,
                lastIntervalPercentage
            } = calculateIntervalOverlapForRange(startDate, endDate, timescale);

            let workOrderWithIntervals: WorkOrderDocumentWithIntervals = {
                ...order,
                firstIntervalDateTime: firstId,
                numberOfIntervals: intervalCount,
                firstIntervalPercentage: firstIntervalPercentage,
                lastIntervalPercentage: lastIntervalPercentage,
            };
            workOrderWithIntervals.width = calculateWidth(workOrderWithIntervals);
            workOrderWithIntervals.leftPosition = calculateLeft(workOrderWithIntervals);
            workOrderWithIntervals.hasEnoughtSpace = workOrderWithIntervals.width > INTERVAL_WIDTH;
            return workOrderWithIntervals;
        }

        return order;
    }

    // This method calculates the number of intervals that are available following each order.
    // Aiming to know what free space are in the screen for small orders to expand
    private calculateOrderCollitions(workOrders: WorkOrderDocument[], timescale: Timescale, viewEnd: moment.Moment,): WorkOrderDocumentWithIntervals[] {
        // sort the entire array by start date
        const sortedOrders = [...workOrders as WorkOrderDocumentWithIntervals[]].sort((a, b) => {
            return moment(a.data.startDate).valueOf() - moment(b.data.startDate).valueOf();
        });

        return sortedOrders.map((order, index) => {
            const endOrderDate = moment(order.data.endDate);

            // look at the next element in the sorted array
            const nextOrder = index + 1 < sortedOrders.length ? sortedOrders[index + 1] : null;

            let intervalsUntilNextCollision: number;

            if (nextOrder?.firstIntervalDateTime) {
                const nextOrderStart = moment(nextOrder.firstIntervalDateTime);

                if (nextOrderStart.clone().startOf(timescale).isSame(moment(order.firstIntervalDateTime).startOf(timescale), timescale)) {
                    intervalsUntilNextCollision = 0;
                } else {
                    // calculate the difference in intervals
                    // Using .diff with the timescale (day, week, month)
                    intervalsUntilNextCollision = nextOrderStart.diff(endOrderDate, timescale);
                }
            } else {
                // when there is no next order, we can assume that the order will collide with the end of the timeline
                intervalsUntilNextCollision = viewEnd.clone().diff(endOrderDate, timescale);
            }
            return {
                ...order,
                intervalsUntilNextCollision
            } as WorkOrderDocumentWithIntervals;
        });
    }

    private getWorkOrdersForWorkCenter(orders: WorkOrderDocument[], workCenterId: string): WorkOrderDocument[] {
        return orders.filter(o => o.data.workCenterId === workCenterId)
    }

    // Actions
    setTimescale(scale: Timescale): void {
        const intervals = calculateIntervals(scale, this.snapshot.visibleIntervalsPast, this.snapshot.visibleIntervalsFuture);
        this.patchState({ timescale: scale, intervals: intervals });
    }

    createWorkOrder(order: WorkOrderDocument): void {
        this.patchState({
            workOrders: [...this.snapshot.workOrders, order]
        });
    }

    updateWorkOrder(updated: WorkOrderDocument): void {
        this.patchState({
            workOrders: this.snapshot.workOrders.map((workOrder) =>
                workOrder.docId === updated.docId ? updated : workOrder
            )
        });
    }

    deleteWorkOrder(id: string): void {
        this.patchState({
            workOrders: this.snapshot.workOrders.filter(o => o.docId !== id)
        });
    }

    //  Mutators or Reducers
    private patchState(patch: Partial<TimelineState>): void {
        this.state$.next({ ...this.snapshot, ...patch });
    }

}
