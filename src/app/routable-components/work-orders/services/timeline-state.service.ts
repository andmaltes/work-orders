import { Injectable } from "@angular/core";
import { BehaviorSubject, combineLatest, combineLatestWith, forkJoin, map, Observable } from "rxjs";
import moment from 'moment';
import { SAMPLE_WORK_CENTERS } from "../../../mock-data/work-center";
import { SAMPLE_WORK_ORDERS } from "../../../mock-data/work-order";
import { WorkOrderDocument, WorkOrderDocumentWithIntervals } from "../model/work-order.interface";
import { TimelineState, Timescale } from "../model/timeline.state";

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

    getIntervalId(date: moment.Moment, timescale: Timescale): string {
        const unit = timescale === 'day' ? 'day' : timescale === 'week' ? 'week' : 'month';
        return date.clone().startOf(unit).format('YYYY-MM-DD');
    }

    getWorkOrdersForWorkCenter(orders: WorkOrderDocument[], workCenterId: string): WorkOrderDocument[] {
        return orders.filter(o => o.data.workCenterId === workCenterId)

    }

    getWorkOrdersForWorkCenterWithIntervals(workCenterId: string): Observable<WorkOrderDocumentWithIntervals[]> {
        return this.state$.pipe(
            map(({ workOrders, timescale, visibleIntervalsPast, visibleIntervalsFuture }: TimelineState) => {
                const unit = timescale === 'day' ? 'day' : timescale === 'week' ? 'week' : 'month';
                const today = moment().startOf(unit);
                const viewStart = today.clone().subtract(visibleIntervalsPast, unit);
                const viewEnd = today.clone().add(visibleIntervalsFuture, unit).endOf(unit);
                var orders = this.getWorkOrdersForWorkCenter(workOrders, workCenterId)

                return orders.map(order => {
                    const startDate = moment(order.data.startDate).startOf('day');
                    const endDate = moment(order.data.endDate).endOf('day');

                    // Only process intervals that fall within the visible range and the order's duration
                    const startInterval = moment.max(startDate.clone().startOf(unit), viewStart);
                    const endInterval = moment.min(endDate.clone().startOf(unit), viewEnd.clone().startOf(unit));

                    if (startInterval.isSameOrBefore(endInterval, unit)) {
                        // First interval
                        const firstId = this.getIntervalId(startInterval, timescale);
                        const firstIntStart = startInterval.clone().startOf(unit);
                        const firstIntEnd = startInterval.clone().endOf(unit);
                        const firstOverlapStart = moment.max(firstIntStart, startDate);
                        const firstOverlapEnd = moment.min(firstIntEnd, endDate);
                        const firstOverlapDuration = firstOverlapEnd.diff(firstOverlapStart, 'minutes');
                        const firstTotalDuration = firstIntEnd.diff(firstIntStart, 'minutes') + 1;
                        const firstPercentage = (firstOverlapDuration / firstTotalDuration) * 100;

                        // Last interval
                        const lastIntStart = endInterval.clone().startOf(unit);
                        const lastIntEnd = endInterval.clone().endOf(unit);
                        const lastOverlapStart = moment.max(lastIntStart, startDate);
                        const lastOverlapEnd = moment.min(lastIntEnd, endDate);
                        const lastOverlapDuration = lastOverlapEnd.diff(lastOverlapStart, 'minutes');
                        const lastTotalDuration = lastIntEnd.diff(lastIntStart, 'minutes') + 1;
                        const lastPercentage = (lastOverlapDuration / lastTotalDuration) * 100;

                        // Number of intervals
                        const numberOfIntervals = endInterval.diff(startInterval, unit) + 1;

                        return {
                            ...order,
                            firstIntervalId: firstId,
                            firstIntervalPercentage: Math.max(0, Math.min(100, firstPercentage)),
                            numberOfIntervals: numberOfIntervals,
                            lastIntervalPercentage: Math.max(0, Math.min(100, lastPercentage))
                        };
                    }

                    return { ...order };
                });
            })
        );
    }

    // Actions
    setTimescale(scale: Timescale): void {
        const intervals = this.calculateIntervals(scale, this.snapshot.visibleIntervalsPast, this.snapshot.visibleIntervalsFuture);
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

    private calculateIntervals(timescale: Timescale, past: number, future: number): string[] {
        const intervals: string[] = [];
        const today = moment();
        const unit = timescale === 'day' ? 'day' : timescale === 'week' ? 'week' : 'month';

        const start = today.clone().subtract(past, unit);
        const end = today.clone().add(future, unit);

        let current = start.clone();
        while (current.isSameOrBefore(end, unit)) {
            intervals.push(this.getIntervalId(current, timescale));
            current.add(1, unit);
        }

        return intervals;
    }
}
