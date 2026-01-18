import { Injectable } from "@angular/core";
import { BehaviorSubject, combineLatest, combineLatestWith, forkJoin, map, Observable } from "rxjs";
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


// This service is a simple state management system for the timeline view. It is intented to simulate NgRx's store
// wihtout all the boilerplate.
// In bigger apps, I would use NgRx.

@Injectable({ providedIn: 'root' })
export class TimelineStateService {
    constructor() { this.setTimescale('day')}
    // State
    private readonly state$ = new BehaviorSubject<TimelineState>({
        workCenters: SAMPLE_WORK_CENTERS,
        workOrders: SAMPLE_WORK_ORDERS,
        timescale: 'day',
        intervals: [],
        visibleIntervalsPast: 7,
        visibleIntervalsFuture: 7
    });

    // Current State
    private get snapshot(): TimelineState {
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



    getWorkOrdersForWorkCenter(orders: WorkOrderDocument[], workCenterId: string): WorkOrderDocument[] {
        return orders.filter(o => o.data.workCenterId === workCenterId)

    }

    getWorkOrdersForWorkCenterWithIntervals(workCenterId: string): Observable<WorkOrderDocumentWithIntervals[]> {
        return this.state$.pipe(
            map(({ workOrders, timescale, visibleIntervalsPast, visibleIntervalsFuture }: TimelineState) => {
                const today = moment().startOf(timescale);
                const viewStart = today.clone().subtract(visibleIntervalsPast, timescale).startOf(timescale);
                const viewEnd = today.clone().add(visibleIntervalsFuture, timescale).endOf(timescale);
                var orders = this.getWorkOrdersForWorkCenter(workOrders, workCenterId)

                return orders.map(order => {
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

                        const {intervalCount,firstIntervalPercentage,lastIntervalPercentage} = calculateIntervalOverlapForRange(startDate,endDate,timescale);

                        return {
                            ...order,
                            firstIntervalDateTime: firstId,
                            numberOfIntervals: intervalCount,
                            firstIntervalPercentage:firstIntervalPercentage,
                            lastIntervalPercentage: lastIntervalPercentage
                        } as WorkOrderDocumentWithIntervals;
                    }

                    return { ...order };
                });
            })
        );
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
            workOrders: this.snapshot.workOrders.map(o =>
                o.docId === updated.docId ? updated : o
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
