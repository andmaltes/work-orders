import { Injectable } from "@angular/core";
import { BehaviorSubject, map, Observable } from "rxjs";
import moment, { Moment } from 'moment';
import { SAMPLE_WORK_CENTERS } from "../../../mock-data/work-center";
import { SAMPLE_WORK_ORDERS } from "../../../mock-data/work-order";
import { WorkOrderDocument, WorkOrderDocumentWithIntervals } from "../model/work-order.interface";
import { Interval, TimelineState, Timescale } from "../model/timeline.state";
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
import { TimelineScrollService } from "./timeline-scroll.service";
import { WorkCenterDocument } from "../model/work-center.interface";


// This service is a simple state management system for the timeline view. It is intented to simulate NgRx's store
// wihtout all the boilerplate.
// In bigger apps, I would use NgRx.
@Injectable({ providedIn: 'root' })
export class TimelineStateService {
 private readonly DEFAULT_VISIBLE_INTERVALS =7;

    // State
    private readonly state$ = new BehaviorSubject<TimelineState>({
        workCenters: SAMPLE_WORK_CENTERS,
        workOrders: SAMPLE_WORK_ORDERS,
        timescale: 'day',
        intervals: [],
        visibleIntervalsPast: this.DEFAULT_VISIBLE_INTERVALS,
        visibleIntervalsFuture:  this.DEFAULT_VISIBLE_INTERVALS,
        workOrdersByWorkCenterWithIntervals: {}
    });

    constructor(private timelinePersistanceService: TimelinePersistanceService, private timelineScrollService:TimelineScrollService) {
        // load from local storage or create a new state
        let storeState = this.timelinePersistanceService.loadFromLocalStorage();
        if (storeState) {
            this.patchState({
                ...storeState,
                visibleIntervalsFuture:  this.DEFAULT_VISIBLE_INTERVALS,
                visibleIntervalsPast:  this.DEFAULT_VISIBLE_INTERVALS,
            });
            this.setTimescale(storeState.timescale);
        }
        this.setTimescale('day');
        this.computeWorkOrdersByWorkCenterWithIntervals();
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

    readonly workOrdersByWorkCenterWithIntervals$ = this.state$.pipe(
        map(state => state.workOrdersByWorkCenterWithIntervals)
    );

    getWorkOrdersForWorkCenter$(workCenterId: string): Observable<WorkOrderDocument[]> {
        return this.workOrders$.pipe(map(
            (workOrders: WorkOrderDocument[]) => {
                return workOrders.filter((workOrder: WorkOrderDocument) => workOrder.data.workCenterId === workCenterId)

            }))
    }

// @upgrade: This method can be futher improved by removing momentjs and having some cache for
    // the orders whose size and position will not change anymore (because they are fulling contained in
    // the viewport already
    // Refactoring this will smoth scroll a little bit.
    private computeWorkOrdersByWorkCenterWithIntervals(input: Partial<TimelineState> = {}) {
        const data = { ...this.snapshot, ...input };
        const { workCenters, workOrders, timescale, visibleIntervalsPast, visibleIntervalsFuture } = data;

        const today = moment().startOf(timescale);
        const viewStart = today.clone().subtract(visibleIntervalsPast, timescale).startOf(timescale);
        const viewEnd = today.clone().add(visibleIntervalsFuture, timescale).endOf(timescale);

        // pre-group orders by Work Center ID to avoid nested O(n^2) filtering
        const ordersByCenter = new Map<string, WorkOrderDocument[]>();
        for (const order of workOrders) {
            const wcId = order.data.workCenterId;
            if (!ordersByCenter.has(wcId)) {
                ordersByCenter.set(wcId, []);
            }
            ordersByCenter.get(wcId)!.push(order);
        }

        const result: { [key: string]: WorkOrderDocumentWithIntervals[] } = {};

        // Iterate through centers
        for (const workCenter of workCenters) {
            const centerOrders = ordersByCenter.get(workCenter.docId) || [];

            // Filter only for this center's orders using the optimized start/end
            const visibleOrders = this.getVisibleWorkOrdersForWorkCenter(
                centerOrders,
                viewStart,
                viewEnd,
                timescale
            );

            // Map to intervals and calculate collisions
            const ordersWithIntervals = visibleOrders.map((order: WorkOrderDocument) =>
                this.computeOrderIntervals(order, viewStart, viewEnd, timescale)
            );

            result[workCenter.docId] = this.calculateOrderCollitions(ordersWithIntervals, timescale, viewEnd);
        }

        this.patchState({ workOrdersByWorkCenterWithIntervals: result });
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
                lastIntervalPercentage,
                intervalsFromStartViewDate
            } = calculateIntervalOverlapForRange(startDate, endDate, timescale, viewStart);

            let workOrderWithIntervals: WorkOrderDocumentWithIntervals = {
                ...order,
                firstIntervalDateTime: firstId,
                numberOfIntervals: intervalCount,
                firstIntervalPercentage: firstIntervalPercentage,
                lastIntervalPercentage: lastIntervalPercentage,
            };
            workOrderWithIntervals.width = calculateWidth(workOrderWithIntervals);
            workOrderWithIntervals.intervalsFromStartViewDate = intervalsFromStartViewDate;
            workOrderWithIntervals.leftPosition = calculateLeft(intervalsFromStartViewDate, workOrderWithIntervals);
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

    private getVisibleWorkOrdersForWorkCenter(orders: WorkOrderDocument[],viewStart: Moment, viewEnd: Moment, timescale: Timescale): WorkOrderDocument[] {
        return orders.filter(o =>
             (
                moment(o.data.startDate).isBetween(viewStart, viewEnd, timescale, '[]')
                || moment(o.data.endDate).isBetween(viewStart, viewEnd, timescale, '[]')
                || (moment(o.data.startDate).isBefore(viewStart) && moment(o.data.endDate).isAfter(viewEnd))
            ));
    }

    // Actions
    setTimescale(scale: Timescale): void {
        const intervals = calculateIntervals(scale,  this.DEFAULT_VISIBLE_INTERVALS,  this.DEFAULT_VISIBLE_INTERVALS);
        this.patchState({ timescale: scale, intervals: intervals, visibleIntervalsPast:  this.DEFAULT_VISIBLE_INTERVALS, visibleIntervalsFuture:  this.DEFAULT_VISIBLE_INTERVALS });
        this.computeWorkOrdersByWorkCenterWithIntervals({ timescale: scale, intervals: intervals, visibleIntervalsPast:  this.DEFAULT_VISIBLE_INTERVALS, visibleIntervalsFuture:  this.DEFAULT_VISIBLE_INTERVALS })
        this.timelineScrollService.scrollToToday();
    }

    createWorkOrder(order: WorkOrderDocument): void {
        const workOrders = [...this.snapshot.workOrders, order];
        this.patchState({
            workOrders
        });
        this.computeWorkOrdersByWorkCenterWithIntervals({ workOrders })
    }

    updateWorkOrder(updated: WorkOrderDocument): void {
        const workOrders = this.snapshot.workOrders.map((workOrder) =>
            workOrder.docId === updated.docId ? updated : workOrder
        );
        this.patchState({
            workOrders
        });
        this.computeWorkOrdersByWorkCenterWithIntervals({ workOrders })
    }

    deleteWorkOrder(id: string): void {
        const workOrders = this.snapshot.workOrders.filter(o => o.docId !== id);
        this.patchState({
            workOrders
        });

        this.computeWorkOrdersByWorkCenterWithIntervals({ workOrders })
    }

    increaseViewPoint(direction: 'past' | 'future'): void {
        let newState: Partial<TimelineState> = {
            visibleIntervalsPast: this.snapshot.visibleIntervalsPast,
            visibleIntervalsFuture: this.snapshot.visibleIntervalsFuture,
        }
        switch (direction) {
            case 'past':
                newState.visibleIntervalsPast = this.snapshot.visibleIntervalsPast +  this.DEFAULT_VISIBLE_INTERVALS;
                break;
            case 'future':
                newState.visibleIntervalsFuture = this.snapshot.visibleIntervalsFuture +  this.DEFAULT_VISIBLE_INTERVALS;
                break;
        }
        newState.intervals = calculateIntervals(this.snapshot.timescale,
            newState.visibleIntervalsPast ?? this.snapshot.visibleIntervalsPast,
            newState.visibleIntervalsFuture ?? this.snapshot.visibleIntervalsFuture);
        this.patchState(newState);
        this.computeWorkOrdersByWorkCenterWithIntervals(newState);
    }

    //  Mutators or Reducers
    private patchState(patch: Partial<TimelineState>): void {
        this.state$.next({ ...this.snapshot, ...patch });
    }

}
