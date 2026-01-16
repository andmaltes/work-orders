import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkOrdersDurationRow } from './work-orders-duration-row';

describe('WorkOrdersDurationRow', () => {
  let component: WorkOrdersDurationRow;
  let fixture: ComponentFixture<WorkOrdersDurationRow>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkOrdersDurationRow]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkOrdersDurationRow);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
