import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkOrdersDetails } from './work-orders-details';

describe('WorkOrdersDetails', () => {
  let component: WorkOrdersDetails;
  let fixture: ComponentFixture<WorkOrdersDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkOrdersDetails]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkOrdersDetails);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
