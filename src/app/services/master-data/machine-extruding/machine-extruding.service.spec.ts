import { TestBed } from '@angular/core/testing';

import { MachineExtrudingService } from './machine-extruding.service';

describe('MachineTassTypeService', () => {
  let service: MachineExtrudingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MachineExtrudingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
