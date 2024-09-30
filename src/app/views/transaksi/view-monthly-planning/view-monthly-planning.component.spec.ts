import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewMonthlyPlanningComponent } from './view-monthly-planning.component';

describe('ViewMonthlyPlanningComponent', () => {
  let component: ViewMonthlyPlanningComponent;
  let fixture: ComponentFixture<ViewMonthlyPlanningComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewMonthlyPlanningComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewMonthlyPlanningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
