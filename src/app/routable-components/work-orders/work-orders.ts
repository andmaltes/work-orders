import { Component } from '@angular/core';
import { TimeScaleSelector } from "./components/time-scale-selector/time-scale-selector";
import { CreateEditWorkOrder } from "./modals/create-edit-work-order/create-edit-work-order";
import { WorkOrdersTable } from "./components/work-orders-table/component/work-orders-table";
import { WorkOrdersTablePage } from "./components/work-orders-table/page/work-orders-table-page";
import { TimelineStateService } from "./services/timeline-state.service";
import { TimelineScrollService } from "./services/timeline-scroll.service";

@Component({
  selector: 'app-work-orders',
  imports: [
    TimeScaleSelector,
    CreateEditWorkOrder,
    WorkOrdersTablePage
  ],
  templateUrl: './work-orders.html',
  styleUrl: './work-orders.scss',
})
export class WorkOrders {
constructor(private timelineScrollService:TimelineScrollService) {
}

  scrollToToday(){
  this.timelineScrollService.scrollToToday();
}
}
