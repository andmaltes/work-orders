import { Component, DestroyRef, inject, OnInit, ViewEncapsulation } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { WorkOrderDocument, WorkOrderStatus } from "../../../model/work-order.interface";
import { CreateEditWorkOrderFormModel } from "../model/create-edit-work-order.model";
import { NgbDateStruct, NgbInputDatepicker } from "@ng-bootstrap/ng-bootstrap";
import { CustomSelector, CustomSelectorOption } from "../../../../../shared-components/custom-selector/custom-selector";
import { JsonPipe, NgForOf, NgIf } from "@angular/common";
import { WorkOrderStatusBadge } from "../../../../../shared-components/work-order-status-badge/work-order-status-badge";
import { dateRangeValidator, workOrderOverlapValidator } from "../../../utils/custom-validators";
import { TimelineStateService } from "../../../services/timeline-state.service";
import moment from "moment";
import { CreateEditWorkOrderModalServiceService } from "../../../services/create-edit-work-order-modal-service.service";
import { combineLatest, combineLatestWith, filter, mergeMap, switchMap, tap } from "rxjs";
import { dateToNgb, ngbToDate } from "../../../utils/date-interval.utils";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";


@Component({
    selector: 'app-create-edit-work-order-form',
    imports: [
        ReactiveFormsModule,
        NgbInputDatepicker,
        CustomSelector,
        NgIf,
        WorkOrderStatusBadge,
    ],
    templateUrl: './create-edit-work-order-form.html',
    styleUrl: './create-edit-work-order-form.scss',
    encapsulation: ViewEncapsulation.None
})
export class CreateEditWorkOrderForm implements OnInit {

    workOrderForm?: FormGroup<CreateEditWorkOrderFormModel>;

    statuses: CustomSelectorOption<WorkOrderStatus>[] = [
        { id: "open", label: 'Open', },
        { id: 'blocked', label: 'Blocked', },
        { id: 'in-progress', label: 'In Progress', },
        { id: 'complete', label: 'Complete', },
    ];
    private destroyRef = inject(DestroyRef);

    constructor(private timelineStateService: TimelineStateService, private createEditWorkOrderModalServiceService: CreateEditWorkOrderModalServiceService) {
    }

    ngOnInit(): void {
        (this.createEditWorkOrderModalServiceService.state$)
            .pipe(
                filter((state) => state.open),
                tap((state) => this.initForm(state.seletedWorkCenterId, state.selectedWorkOrderId)),
                takeUntilDestroyed(this.destroyRef)
            ).subscribe()
    }

    initForm(workCenterId: string, workOrderId?:string): void {
        let workOrdersForCenter = this.timelineStateService.getWorkOrdersForWorkCenter$(workCenterId);
        let workOrder = this.timelineStateService.snapshot.workOrders.find((workOrder)=>workOrder.docId == workOrderId);
        if(workOrder){
            //edit mode
            this.workOrderForm = new FormGroup<CreateEditWorkOrderFormModel>({
                    workCenterId: new FormControl<string>(workCenterId, {
                        nonNullable: true,
                        validators: Validators.required
                    }),
                    workOrderId: new FormControl<string>(workOrderId ?? '', {
                        nonNullable: true,
                        validators: Validators.required
                    }),
                    name: new FormControl<string>(workOrder.data.name, {
                        nonNullable: true,
                        validators: [Validators.required, Validators.maxLength(100)],
                    }),
                    status: new FormControl<WorkOrderStatus>(workOrder.data.status, {
                        nonNullable: true,
                        validators: Validators.required,
                    }),
                    startDate: new FormControl<NgbDateStruct | null>(dateToNgb(moment(workOrder.data.startDate)), {
                        nonNullable: true,
                        validators: Validators.required,
                    }),
                    endDate: new FormControl<NgbDateStruct | null>(dateToNgb(moment(workOrder.data.endDate)), {
                        nonNullable: true,
                        validators: Validators.required,
                    }),
                },
                {
                    validators: dateRangeValidator,
                    asyncValidators: [
                        workOrderOverlapValidator(workOrdersForCenter, workOrderId)
                    ]
                }
            );

        }else {
            //create mode
            this.workOrderForm = new FormGroup<CreateEditWorkOrderFormModel>({
                    workCenterId: new FormControl<string>(workCenterId, {
                        nonNullable: true,
                        validators: Validators.required
                    }),
                    workOrderId: new FormControl<string>('', {
                        nonNullable: true,
                        validators: Validators.required
                    }),
                    name: new FormControl<string>('', {
                        nonNullable: true,
                        validators: [Validators.required, Validators.maxLength(100)],
                    }),
                    status: new FormControl<WorkOrderStatus>('open', {
                        nonNullable: true,
                        validators: Validators.required,
                    }),
                    startDate: new FormControl<NgbDateStruct | null>(null, {
                        nonNullable: true,
                        validators: Validators.required,
                    }),
                    endDate: new FormControl<NgbDateStruct | null>(null, {
                        nonNullable: true,
                        validators: Validators.required,
                    }),
                },
                {
                    validators: dateRangeValidator,
                    asyncValidators: [
                        workOrderOverlapValidator(workOrdersForCenter)
                    ]
                }
            );
        }
    }

    onStatusChange(status: CustomSelectorOption<WorkOrderStatus>) {
        this.workOrderForm?.patchValue({ status: status.id });
    }

    onCreate() {
        if (this.workOrderForm?.invalid) {
            this.workOrderForm?.markAllAsTouched();
            return;
        } else {
            let now = new Date();
            let workOrderData = this.workOrderForm?.value;
            let workOrder: WorkOrderDocument = {
                docId: workOrderData?.workOrderId  || "wo-" + now.getTime(),
                docType: "workOrder",
                data: {
                    name: workOrderData?.name || '',
                    workCenterId: workOrderData?.workCenterId || '',
                    status: workOrderData?.status || 'open',
                    startDate: workOrderData?.startDate ? moment(ngbToDate(workOrderData?.startDate)).format("YYYY-MM-DD") : '',
                    endDate: workOrderData?.endDate ? moment(ngbToDate(workOrderData?.endDate)).format("YYYY-MM-DD") : ''
                }
            };
            if(workOrderData?.workOrderId){
                this.timelineStateService.updateWorkOrder(workOrder);
            }else {
                this.timelineStateService.createWorkOrder(workOrder);
            }
            this.createEditWorkOrderModalServiceService.close();
        }
    }

    onCancel() {
        this.workOrderForm?.reset({
            status: "open",
        });
        this.createEditWorkOrderModalServiceService.close();
    }
}
