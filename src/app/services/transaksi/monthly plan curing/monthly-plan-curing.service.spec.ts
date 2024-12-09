import { TestBed } from '@angular/core/testing';

import { MonthlyPlanCuringService } from './monthly-plan-curing.service';

describe('MonthlyPlanCuringService', () => {
  let service: MonthlyPlanCuringService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MonthlyPlanCuringService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
