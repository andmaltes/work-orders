import { Component, ViewEncapsulation } from '@angular/core';
import { NgSelectComponent } from "@ng-select/ng-select";
import { FormsModule } from "@angular/forms";
import { TimelineStateService } from "../../services/timeline-state.service";
import { Timescale } from "../../model/timeline.state";
import { CustomSelector, CustomSelectorOption } from "../../../../shared-components/custom-selector/custom-selector";

@Component({
    selector: 'app-time-scale-selector',
    imports: [
        FormsModule,
        CustomSelector
    ],
    templateUrl: './time-scale-selector.html',
    styleUrl: './time-scale-selector.scss',
    encapsulation: ViewEncapsulation.None
})
export class TimeScaleSelector {

    zoomLevels: CustomSelectorOption<Timescale>[] = [
        { id: 'day', label: 'Day', },
        { id: 'week', label: 'Week', },
        { id: 'month', label: 'Month', }
    ];

    selectedZoomLevel: CustomSelectorOption<Timescale> = {
        id: 'day', label: 'Day',
    };

    constructor(private timelineStateService: TimelineStateService) {

    }

    onTimeScaleChange(timeScale: CustomSelectorOption<Timescale>) {
        this.timelineStateService.setTimescale(timeScale.id)
        this.selectedZoomLevel = timeScale;
    }
}