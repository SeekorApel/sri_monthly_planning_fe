import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewDetailMonthlyPlanningComponent } from './view-detail-monthly-planning.component';

describe('ViewDetailMonthlyPlanningComponent', () => {
  let component: ViewDetailMonthlyPlanningComponent;
  let fixture: ComponentFixture<ViewDetailMonthlyPlanningComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewDetailMonthlyPlanningComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewDetailMonthlyPlanningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
