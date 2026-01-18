import { WorkOrderDocument } from "../routable-components/work-orders/model/work-order.interface";

export const SAMPLE_WORK_ORDERS: WorkOrderDocument[] = [
    {
        docId: "wo-0001",
        docType: "workOrder",
        data: {
            name: "WO-0001 – Extrusion Batch 101",
            workCenterId: "wc-extrusion-a",
            status: "complete",
            startDate: "2025-12-15",
            endDate: "2026-02-15"
        }
    },
    {
        docId: "wo-0002",
        docType: "workOrder",
        data: {
            name: "WO-0002 – Extrusion Batch 102",
            workCenterId: "wc-assembly-1",
            status: "in-progress",
            startDate: "2026-01-10",
            endDate: "2026-01-16"
        }
    },
    {
        docId: "wo-0003",
        docType: "workOrder",
        data: {
            name: "WO-0003 – CNC Rough Cut",
            workCenterId: "wc-cnc-1",
            status: "open",
            startDate: "2026-01-16",
            endDate: "2026-01-20"
        }
    },
    {
        docId: "wo-0004",
        docType: "workOrder",
        data: {
            name: "WO-0004 – CNC Finish Pass",
            workCenterId: "wc-cnc-1",
            status: "blocked",
            startDate: "2026-01-12",
            endDate: "2026-01-13"
        }
    },
];
