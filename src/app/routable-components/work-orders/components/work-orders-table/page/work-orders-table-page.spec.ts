import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkOrdersTablePage } from './work-orders-table-page';

describe('WorkOrdersTablePage', () => {
  let component: WorkOrdersTablePage;
  let fixture: ComponentFixture<WorkOrdersTablePage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkOrdersTablePage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkOrdersTablePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
