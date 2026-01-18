import { Injectable } from "@angular/core";
import { BehaviorSubject, map } from "rxjs";
import { CreateEditWorkOrderState } from "../model/create-edit-work-order.state";
import { TimelineState } from "../model/timeline.state";

@Injectable({ providedIn: 'root' })
export class CreateEditWorkOrderModalServiceService {
    readonly state$ = new BehaviorSubject<CreateEditWorkOrderState>({
        open: false,
        selectedWorkOrderId: '',
        seletedWorkCenterId: '',
    });

    // Current State
    private get snapshot(): CreateEditWorkOrderState {
        return this.state$.getValue();
    }

    //  Selectors
    readonly open$ = this.state$.pipe(
        map(state => state.open)
    );

    readonly seletedWorkCenterId$ = this.state$.pipe(
        map(state => state.seletedWorkCenterId)
    );





    // Actions
    open(workCenterId:string, workOrderId?: string) {
        this.patchState({open:true, seletedWorkCenterId: workCenterId, selectedWorkOrderId: workOrderId});
    }

    close() {
        this.patchState({open:false});
    }

    //  Mutators or Reducers
    private patchState(patch: Partial<CreateEditWorkOrderState>): void {
        this.state$.next({ ...this.snapshot, ...patch });
    }
}