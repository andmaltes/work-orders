import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkOrderStatusBadge } from './work-order-status-badge';

describe('WorkOrderStatusBadge', () => {
  let component: WorkOrderStatusBadge;
  let fixture: ComponentFixture<WorkOrderStatusBadge>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkOrderStatusBadge]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkOrderStatusBadge);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
