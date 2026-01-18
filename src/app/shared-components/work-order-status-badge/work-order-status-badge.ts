import { Component, Input } from '@angular/core';
import { WorkOrderStatus } from "../../routable-components/work-orders/model/work-order.interface";
import { NgIf } from "@angular/common";

@Component({
  selector: 'app-work-order-status-badge',
  imports: [
    NgIf
  ],
  templateUrl: './work-order-status-badge.html',
  styleUrl: './work-order-status-badge.scss',
})
export class WorkOrderStatusBadge {
@Input() orderStatus!: WorkOrderStatus;
}
