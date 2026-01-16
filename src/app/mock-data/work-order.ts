import { WorkOrderDocument } from "../routable-components/work-orders/model/work-order.interface";

export const SAMPLE_WORK_ORDERS: WorkOrderDocument[] = [
    {
        docId: "wo-0001",
        docType: "workOrder",
        data: {
            name: "WO-0001 – Extrusion Batch 101",
            workCenterId: "wc-extrusion-a",
            status: "complete",
            startDate: "2025-12-01",
            endDate: "2026-02-28"
        }
    },
    {
        docId: "wo-0002",
        docType: "workOrder",
        data: {
            name: "WO-0002 – Extrusion Batch 102",
            workCenterId: "wc-assembly-1",
            status: "complete",
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
            status: "complete",
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
            status: "complete",
            startDate: "2024-08-08",
            endDate: "2024-08-09"
        }
    },
    {
        docId: "wo-0005",
        docType: "workOrder",
        data: {
            name: "WO-0005 – Assembly Subframe",
            workCenterId: "wc-assembly-1",
            status: "complete",
            startDate: "2024-08-10",
            endDate: "2024-08-12"
        }
    },
    {
        docId: "wo-0006",
        docType: "workOrder",
        data: {
            name: "WO-0006 – Quality Inspection",
            workCenterId: "wc-quality",
            status: "complete",
            startDate: "2024-08-13",
            endDate: "2024-08-13"
        }
    },
    {
        docId: "wo-0007",
        docType: "workOrder",
        data: {
            name: "WO-0007 – Final Packaging",
            workCenterId: "wc-packaging",
            status: "complete",
            startDate: "2024-08-14",
            endDate: "2024-08-15"
        }
    },
    {
        docId: "wo-0008",
        docType: "workOrder",
        data: {
            name: "WO-0008 – Extrusion Batch 103",
            workCenterId: "wc-extrusion-a",
            status: "in-progress",
            startDate: "2025-01-10",
            endDate: "2025-01-14"
        }
    },
    {
        docId: "wo-0009",
        docType: "workOrder",
        data: {
            name: "WO-0009 – CNC Precision Drill",
            workCenterId: "wc-cnc-1",
            status: "blocked",
            startDate: "2025-01-15",
            endDate: "2025-01-16"
        }
    },
    {
        docId: "wo-0010",
        docType: "workOrder",
        data: {
            name: "WO-0010 – Assembly Final Fit",
            workCenterId: "wc-assembly-1",
            status: "open",
            startDate: "2025-02-01",
            endDate: "2025-02-03"
        }
    }
];
