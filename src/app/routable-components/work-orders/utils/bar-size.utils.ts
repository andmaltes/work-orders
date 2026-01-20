import { WorkOrderDocumentWithIntervals } from "../model/work-order.interface";
import { INTERVAL_WIDTH } from "../model/const";
import { Moment } from "moment";

/* This method calculates the width of the work order duration as follows:
* 1. The total number of intervals multiplied by the interval width
* 2. Subtract the percentage of the first and the last interval that is not beign shown.
*    This happens when the total duration is not totally covering the interval. For intance,
*    when the order dates are Jan 13 to Feb 20, and we are in the montly view, the bar is not fully
*    covering Jan and Feb
* */
export  function calculateWidth(workorder: WorkOrderDocumentWithIntervals): number {
    if (!workorder.numberOfIntervals) {
        return 0;
    }

    let totalIntervalsWidth = workorder.numberOfIntervals * INTERVAL_WIDTH;

    if (workorder.firstIntervalPercentage !== 1) {
        totalIntervalsWidth = totalIntervalsWidth - (1 - (workorder.firstIntervalPercentage || 0)) * INTERVAL_WIDTH;
    }

    if (workorder.lastIntervalPercentage !== 0) {
        totalIntervalsWidth = totalIntervalsWidth - (1 - (workorder.lastIntervalPercentage || 0)) * INTERVAL_WIDTH;
    }


    return totalIntervalsWidth;
}

// When the duration is not totally covering the interval, this method calculates the left position of the bar
export function calculateLeft(intervalsFromStartViewDate:number,workorder: WorkOrderDocumentWithIntervals): number {
    // padding + first interval percentage + intervals from start view date
    return 5 + ((1 - (workorder.firstIntervalPercentage || 0)) * INTERVAL_WIDTH) + ((INTERVAL_WIDTH * intervalsFromStartViewDate));
}