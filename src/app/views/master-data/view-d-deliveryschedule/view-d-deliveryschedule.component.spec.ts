import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewDDeliveryScheduleComponent } from './view-d-deliveryschedule.component';

describe('ViewDDeliveryScheduleComponent', () => {
  let component: ViewDDeliveryScheduleComponent;
  let fixture: ComponentFixture<ViewDDeliveryScheduleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewDDeliveryScheduleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewDDeliveryScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
