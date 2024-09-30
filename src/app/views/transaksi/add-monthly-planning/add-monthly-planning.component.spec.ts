import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMonthlyPlanningComponent } from './add-monthly-planning.component';

describe('AddMonthlyPlanningComponent', () => {
  let component: AddMonthlyPlanningComponent;
  let fixture: ComponentFixture<AddMonthlyPlanningComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddMonthlyPlanningComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddMonthlyPlanningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
