import { Component } from '@angular/core';
import { TimeScaleSelector } from "./components/time-scale-selector/time-scale-selector";
import { WorkOrdersTable } from "./components/work-orders-table/work-orders-table";
import { CreateEditWorkOrder } from "./modals/create-edit-work-order/create-edit-work-order";

@Component({
  selector: 'app-work-orders',
  imports: [
    TimeScaleSelector,
    WorkOrdersTable,
    CreateEditWorkOrder
  ],
  templateUrl: './work-orders.html',
  styleUrl: './work-orders.scss',
})
export class WorkOrders {

}
