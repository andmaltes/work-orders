import { WorkCenterDocument } from "./work-center.interface";
import { WorkOrderDocument } from "./work-order.interface";

export interface TimelineState {
    workCenters: WorkCenterDocument[];
    workOrders: WorkOrderDocument[];
    timescale: Timescale;
    intervals: Interval[];
    visibleIntervalsPast: number;
    visibleIntervalsFuture: number;
}

export interface Interval {
    intervalId: number;
    formattedName?:string;
    timescale?:string;
    isToday:boolean;
}

export type Timescale = 'day' | 'week' | 'month' ;