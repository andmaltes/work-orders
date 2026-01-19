import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkOrdersTable } from './work-orders-table';

describe('WorkOrdersTable', () => {
  let component: WorkOrdersTable;
  let fixture: ComponentFixture<WorkOrdersTable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkOrdersTable]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkOrdersTable);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
