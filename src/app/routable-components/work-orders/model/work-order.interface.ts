export interface WorkOrderDocument {
    docId: string;
    docType: 'workOrder';
    data: {
        name: string;
        workCenterId: string;           // References WorkCenterDocument.docId
        status: WorkOrderStatus;
        startDate: string;              // ISO format (e.g., "2025-01-15")
        endDate: string;                // ISO format
    };
}

export interface WorkOrderDocumentWithIntervals extends WorkOrderDocument {
    // interval datetime is the first day of the month, or the first day of the week or the day at first time,
    // depending on the timescale.
    firstIntervalDateTime?: number;
    // This means, how much of the first interval needs to be removed in order to have accurate positioning
    // (e.g., if the interval is monthly and the day is 15, then the bar will start in the middle of the interval)
    firstIntervalPercentage?: number;
    // total number of intervals including whole first and whole last
    numberOfIntervals?: number;
    // This means, how much of the last interval needs to be removed in order to have accurate positioning
    // (e.g., if the interval is monthly and the day is 15, then the bar will finish in the middle of the interval)
    lastIntervalPercentage?: number;
    // required width of the bar
    width?: number;
    leftPosition?: number;
    // Whether the work order has enough space to be displayed without overlapping with other work orders
    hasEnoughtSpace?: boolean;
    intervalsUntilNextCollision?:number
}

export type WorkOrderStatus = 'open' | 'in-progress' | 'complete' | 'blocked';