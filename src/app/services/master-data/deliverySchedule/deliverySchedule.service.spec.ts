import { TestBed } from '@angular/core/testing';

import { DeliveryScheduleService } from './deliverySchedule.service';

describe('DeliveryScheduleService', () => {
  let service: DeliveryScheduleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DeliveryScheduleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
