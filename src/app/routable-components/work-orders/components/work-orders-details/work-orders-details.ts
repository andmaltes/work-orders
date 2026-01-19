import { Component, Input } from '@angular/core';
import { WorkOrderDocument } from "../../model/work-order.interface";
import { NgIf } from "@angular/common";
import { WorkOrderStatusBadge } from "../../../../shared-components/work-order-status-badge/work-order-status-badge";

@Component({
  selector: 'app-work-orders-details',
  imports: [
    NgIf,
    WorkOrderStatusBadge
  ],
  templateUrl: './work-orders-details.html',
  styleUrl: './work-orders-details.scss',
})
export class WorkOrdersDetails {
@Input({required: true}) workOrder?: WorkOrderDocument;
}
