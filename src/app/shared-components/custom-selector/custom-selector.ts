import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { NgLabelTemplateDirective, NgSelectComponent } from "@ng-select/ng-select";
import { FormsModule } from "@angular/forms";

@Component({
  selector: 'app-custom-selector',
  imports: [
    NgLabelTemplateDirective,
    NgSelectComponent,
    FormsModule
  ],
  templateUrl: './custom-selector.html',
  styleUrl: './custom-selector.scss',
  encapsulation: ViewEncapsulation.None
})
export class CustomSelector <T> implements OnInit {
  @Input() items: CustomSelectorOption<T>[] = [];
  @Input() defaultValue?: CustomSelectorOption<T>;

  @Output() onItemSelected = new EventEmitter<CustomSelectorOption<T>>();

  selectedItem?: CustomSelectorOption<T>;


  ngOnInit(): void {
    this.selectedItem = this.defaultValue;
  }

  itemSelected(item: CustomSelectorOption<T>): void {
    this.onItemSelected.emit(item);
  }
}

export interface CustomSelectorOption<T> {
  id: T;
  label: string;
}