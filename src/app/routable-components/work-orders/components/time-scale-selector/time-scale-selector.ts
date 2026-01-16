import { Component, ViewEncapsulation } from '@angular/core';
import { NgSelectComponent } from "@ng-select/ng-select";
import { FormsModule } from "@angular/forms";
import { TimelineStateService } from "../../services/timeline-state.service";
import { Timescale } from "../../model/timeline.state";

@Component({
  selector: 'app-time-scale-selector',
  imports: [
    NgSelectComponent,
    FormsModule
  ],
  templateUrl: './time-scale-selector.html',
  styleUrl: './time-scale-selector.scss',
    encapsulation: ViewEncapsulation.None
})
export class TimeScaleSelector {
    constructor(private timelineStateService:TimelineStateService) {

    }
  zoomLevels: ZoomLevel[] = [{
   id:'day', label:'Day',},{
   id:'week', label:'Week',},{
   id:'month', label:'Month',
 }];

  selectedZoomLevelId: ZoomLevel = {
      id:'day', label:'Day',};

  onTimeScaleChange(timeScale: ZoomLevel) {
this.timelineStateService.setTimescale(timeScale.id)
  }
}

interface ZoomLevel {
    id:Timescale;
    label:string;
}