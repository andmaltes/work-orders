import moment from "moment";
import { Interval, Timescale } from "../model/timeline.state";
import { NgbDateStruct } from "@ng-bootstrap/ng-bootstrap";

// Depending on the timescale we need an id to represent the date. For intance, if we are in a month interval
// 1 sept and 3 of sept will fall in the same id (as they belong to the same month)
export function getDateInIntervalId(date: moment.Moment, timescale: Timescale): number {
    return date.clone().startOf(timescale).toDate().getTime();
}

export interface IntervalOverlapResult {
    intervalCount: number;
    firstIntervalPercentage: number;
    lastIntervalPercentage: number;
    intervalsFromStartViewDate: number;
}

export function calculateIntervalOverlapForRange(
    startDate: moment.Moment,
    endDate: moment.Moment,
    interval: Timescale,
    startDateView:moment.Moment
): IntervalOverlapResult {

    const start = moment(startDate);
    const end = moment(endDate);

    if (!start.isValid() || !end.isValid() || end.isBefore(start)) {
        return { intervalCount: 0, firstIntervalPercentage: 0, lastIntervalPercentage: 0, intervalsFromStartViewDate:0 }
    }

    // Align to interval boundaries
    const firstIntervalStart = start.clone().startOf(interval);
    const lastIntervalEnd = end.clone().endOf(interval);

    // Count intervals
    const intervalCount =
        lastIntervalEnd.diff(firstIntervalStart, interval) + 1;

    const firstIntervalPercentage = percentageCoveredFromStart(start, interval);
    const lastIntervalPercentage = percentageCoveredUntilEnd(end, interval);

    const intervalsFromStartViewDate = moment(firstIntervalStart).diff(startDateView.clone().startOf(interval), interval);

    return {
        intervalCount,
        firstIntervalPercentage,
        lastIntervalPercentage,
        intervalsFromStartViewDate
    };
}

function percentageCoveredFromStart(
    date: moment.Moment,
    interval: Timescale
): number {
    const intervalStart = date.clone().startOf(interval);
    const intervalEnd = date.clone().endOf(interval);

    const duration = intervalEnd.diff(intervalStart);
    const covered = intervalEnd.diff(date);

    return covered / duration;
}

function percentageCoveredUntilEnd(
    date: moment.Moment,
    interval: Timescale
): number {
    const intervalStart = date.clone().startOf(interval);
    const intervalEnd = date.clone().endOf(interval);

    if (date.isSame(intervalEnd)) {
        return 1;
    }

    const duration = intervalEnd.diff(intervalStart);
    const covered = date.diff(intervalStart);

    return covered / duration;
}



export function calculateIntervals(timescale: Timescale, past: number, future: number): Interval[] {
    const intervals: Interval[] = [];
    const today = moment();
    const unit = timescale === 'day' ? 'day' : timescale === 'week' ? 'week' : 'month';

    const start = today.clone().subtract(past, unit);
    const end = today.clone().add(future, unit);

    let current = start.clone();
    while (current.isSameOrBefore(end, unit)) {
        intervals.push({intervalId: getDateInIntervalId(current, timescale), isToday: current.isSame(today, unit)});
        current.add(1, unit);
    }

    return intervals;
}

export function ngbToDate(date: NgbDateStruct): Date {
    return new Date(date.year, date.month - 1, date.day);
}

export function dateToNgb(date: moment.Moment): NgbDateStruct {
    return {
        year: date.year(),
        month: date.month() + 1,
        day: date.date()
    };
}

