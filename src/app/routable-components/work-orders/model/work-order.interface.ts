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
    // interval id means day or month or whatever is selected in the filter
    // while number is the percentage of that interval
    firstIntervalId?: string;
    firstIntervalPercentage?: number;
    numberOfIntervals?: number;
    lastIntervalPercentage?: number;
}

export type WorkOrderStatus = 'open' | 'in-progress' | 'complete' | 'blocked';