import { WorkOrderStatus } from "../../../model/work-order.interface";
import {  FormControl } from "@angular/forms";
import { NgbDateStruct } from "@ng-bootstrap/ng-bootstrap";

export interface CreateEditWorkOrderFormModel {
    workCenterId:FormControl<string>,
    workOrderId:FormControl<string | null>,
    name:FormControl<string>,
        status: FormControl<WorkOrderStatus |  null>,
        startDate:FormControl<NgbDateStruct|null>,
        endDate:FormControl<NgbDateStruct|null>,
}