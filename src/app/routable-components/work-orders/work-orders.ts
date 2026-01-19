import { Component } from '@angular/core';
import { TimeScaleSelector } from "./components/time-scale-selector/time-scale-selector";
import { CreateEditWorkOrder } from "./modals/create-edit-work-order/create-edit-work-order";
import { WorkOrdersTable } from "./components/work-orders-table/component/work-orders-table";
import { WorkOrdersTablePage } from "./components/work-orders-table/page/work-orders-table-page";

@Component({
  selector: 'app-work-orders',
  imports: [
    TimeScaleSelector,
    WorkOrdersTable,
    CreateEditWorkOrder,
    WorkOrdersTablePage
  ],
  templateUrl: './work-orders.html',
  styleUrl: './work-orders.scss',
})
export class WorkOrders {

}
