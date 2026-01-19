import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkOrdersDurationRowPage } from './work-orders-duration-row-page';

describe('WorkOrdersDurationRowPage', () => {
  let component: WorkOrdersDurationRowPage;
  let fixture: ComponentFixture<WorkOrdersDurationRowPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkOrdersDurationRowPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkOrdersDurationRowPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
