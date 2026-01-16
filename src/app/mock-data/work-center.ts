import { WorkCenterDocument } from "../routable-components/work-orders/model/work-center.interface";

export const SAMPLE_WORK_CENTERS: WorkCenterDocument[] = [
    {
        docId: "wc-extrusion-a",
        docType: "workCenter",
        data: { name: "Extrusion Line A" }
    },
    {
        docId: "wc-cnc-1",
        docType: "workCenter",
        data: { name: "CNC Machine 1" }
    },
    {
        docId: "wc-assembly-1",
        docType: "workCenter",
        data: { name: "Assembly Station 1" }
    },
    {
        docId: "wc-quality",
        docType: "workCenter",
        data: { name: "Quality Control" }
    },
    {
        docId: "wc-packaging",
        docType: "workCenter",
        data: { name: "Packaging Line" }
    }
];
