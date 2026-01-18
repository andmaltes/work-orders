import { Component, OnInit } from '@angular/core';
import { CreateEditWorkOrderForm } from "./create-edit-work-order-form/create-edit-work-order-form";
import { CreateEditWorkOrderModalServiceService } from "../../services/create-edit-work-order-modal-service.service";
import { Observable } from "rxjs";
import { AsyncPipe } from "@angular/common";
import { animate, state, style, transition, trigger } from "@angular/animations";

const slideInOut = trigger('slideInOut', [
  state('in', style({
    transform: 'translateX(0)'
  })),
  state('out', style({
    transform: 'translateX(100%)'
  })),
  transition('out => in', [
    animate('300ms ease-out')
  ]),
  transition('in => out', [
    animate('300ms ease-in')
  ])
]);

const opacityInOut =     trigger('opacityInOut', [
  state('hidden', style({
    opacity: 0,
    pointerEvents: 'none'
  })),
  state('visible', style({
    opacity: 0.5,
    pointerEvents: 'auto'
  })),
  transition('hidden <=> visible', animate('300ms ease-in-out'))
]);



@Component({
  selector: 'app-create-edit-work-order',
  imports: [
    CreateEditWorkOrderForm,
    AsyncPipe
  ],
  templateUrl: './create-edit-work-order.html',
  styleUrl: './create-edit-work-order.scss',
  animations: [slideInOut,opacityInOut]
})
export class CreateEditWorkOrder implements OnInit{
  isOpen$!:Observable<boolean>;

  constructor(private createEditWorkOrderModalServiceService: CreateEditWorkOrderModalServiceService) {}
  ngOnInit(): void {
    this.isOpen$ = this.createEditWorkOrderModalServiceService.open$;
  }

  close (){
    this.createEditWorkOrderModalServiceService.close();
  };
}
