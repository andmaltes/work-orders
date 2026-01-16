import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimeScaleSelector } from './time-scale-selector';

describe('TimeScaleSelector', () => {
  let component: TimeScaleSelector;
  let fixture: ComponentFixture<TimeScaleSelector>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TimeScaleSelector]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TimeScaleSelector);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
