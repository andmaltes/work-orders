import { Subject } from "rxjs";
import { Injectable } from "@angular/core";

// Scroll service so any component can request a scroll to today
// Useful for adding a today button
@Injectable({ providedIn: 'root' })
export class TimelineScrollService {
    private scrollRequestSource = new Subject<void>();
    scrollRequest$ = this.scrollRequestSource.asObservable();

    scrollToToday() {
        this.scrollRequestSource.next();
    }
}