import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewWorkDayComponent } from './view-work-day.component';

describe('ViewWorkDayComponent', () => {
  let component: ViewWorkDayComponent;
  let fixture: ComponentFixture<ViewWorkDayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewWorkDayComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewWorkDayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
