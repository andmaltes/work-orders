import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateEditWorkOrder } from './create-edit-work-order';

describe('CreateEditWorkOrder', () => {
  let component: CreateEditWorkOrder;
  let fixture: ComponentFixture<CreateEditWorkOrder>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateEditWorkOrder]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateEditWorkOrder);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
