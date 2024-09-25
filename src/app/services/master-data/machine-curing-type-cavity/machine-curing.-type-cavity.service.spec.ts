import { TestBed } from '@angular/core/testing';

import { MachineCuringTypeCavityService } from './machine-curing-type-cavity.service';

describe('MachineCuringTypeCavityService', () => {
  let service: MachineCuringTypeCavityService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MachineCuringTypeCavityService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
