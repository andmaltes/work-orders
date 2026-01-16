import { WorkCenterDocument } from "./work-center.interface";
import { WorkOrderDocument } from "./work-order.interface";

export interface TimelineState {
    workCenters: WorkCenterDocument[];
    workOrders: WorkOrderDocument[];
    timescale: Timescale;
    intervals: string[];
    visibleIntervalsPast: number;
    visibleIntervalsFuture: number;
}

export type Timescale = 'day' | 'week' | 'month' ;