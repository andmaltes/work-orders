import { Injectable } from "@angular/core";
import { TimelineState } from "../model/timeline.state";

@Injectable({ providedIn: 'root' })
export class TimelinePersistanceService {
    private TIMELINE_STATE_KEY: string = 'timeline_state';

    loadFromLocalStorage(): TimelineState | null {
        try {
            const raw = localStorage.getItem(this.TIMELINE_STATE_KEY);
            return raw ? JSON.parse(raw) as TimelineState : null;
        } catch {
            return null;
        }
    }

    storeInLocalStorage(state: TimelineState) {
        localStorage.setItem(
            this.TIMELINE_STATE_KEY,
            JSON.stringify(state)
        );
    }

}
