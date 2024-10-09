import { TestBed } from '@angular/core/testing';

import { DDeliveryScheduleService } from './DdeliverySchedule.service';

describe('DDeliveryScheduleService', () => {
  let service: DDeliveryScheduleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DDeliveryScheduleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
