import { TestBed } from '@angular/core/testing';

import { machineAllowanceService } from './machine-allowance.service';

describe('PlantService', () => {
  let service: machineAllowanceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(machineAllowanceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
