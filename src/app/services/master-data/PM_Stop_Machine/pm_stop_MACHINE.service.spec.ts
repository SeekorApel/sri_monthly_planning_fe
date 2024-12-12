import { TestBed } from '@angular/core/testing';

import { PMStopMachineService } from './pm_stop_MACHINE.service';

describe('PMStopMachineService', () => {
  let service: PMStopMachineService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PMStopMachineService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
