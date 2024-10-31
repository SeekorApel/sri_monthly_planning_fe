import { TestBed } from '@angular/core/testing';

import { WorkDayService } from './work-day.service';

describe('PlantService', () => {
  let service: WorkDayService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WorkDayService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
