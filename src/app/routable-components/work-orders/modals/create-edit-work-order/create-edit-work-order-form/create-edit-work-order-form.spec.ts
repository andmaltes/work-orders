import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateEditWorkOrderForm } from './create-edit-work-order-form';

describe('CreateEditWorkOrderForm', () => {
  let component: CreateEditWorkOrderForm;
  let fixture: ComponentFixture<CreateEditWorkOrderForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateEditWorkOrderForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateEditWorkOrderForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
