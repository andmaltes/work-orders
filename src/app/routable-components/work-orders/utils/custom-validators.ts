import { AbstractControl, ValidationErrors } from "@angular/forms";
import { map, Observable, of, take, tap } from "rxjs";
import { WorkOrderDocument } from "../model/work-order.interface";
import moment from "moment";
import { ngbToDate } from "./date-interval.utils";

export function dateRangeValidator(group: AbstractControl) {
    const start = group.get('startDate')?.value;
    const end = group.get('endDate')?.value;

    if (!start || !end) return null;

    let momentStart = moment(start);
    let momentEnd = moment(end);

    return momentStart.isSameOrBefore(momentEnd)
        ? null
        : { dateRangeInvalid: true };
}

export function workOrderOverlapValidator(workOrdersObservable: Observable<WorkOrderDocument[]>, currentWorkOrderId?: string) {
    return (group: AbstractControl): Observable<ValidationErrors | null> => {
        const start = group.get('startDate')?.value;
        const end = group.get('endDate')?.value;

        if (!start || !end) return of(null);

        const startDate = moment(ngbToDate(start));
        const endDate = moment(ngbToDate(end));
        return workOrdersObservable.pipe(
            take(1),
            map((workOrders: WorkOrderDocument[]) => {
                const hasOverlap = workOrders.find((workOrder: WorkOrderDocument) => {
                    // Skip the current work order being edited
                    if (currentWorkOrderId && workOrder.docId === currentWorkOrderId) {
                        return false;
                    }

                    const woStart = moment(workOrder.data.startDate);
                    const woEnd = moment(workOrder.data.endDate);

                    // Check if date ranges overlap
                    return (startDate.isBetween(woStart, woEnd,'day','[]') || endDate.isBetween(woStart, woEnd,'day','[]'));
                });

                return hasOverlap ? { workOrderOverlap: hasOverlap } : null;
            })
        )

    };
}

