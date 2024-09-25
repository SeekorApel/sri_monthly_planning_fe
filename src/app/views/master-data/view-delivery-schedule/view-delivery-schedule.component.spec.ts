import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewDeliveryScheduleComponent } from './view-delivery-schedule.component';

describe('ViewDeliveryScheduleComponent', () => {
  let component: ViewDeliveryScheduleComponent;
  let fixture: ComponentFixture<ViewDeliveryScheduleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewDeliveryScheduleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewDeliveryScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
