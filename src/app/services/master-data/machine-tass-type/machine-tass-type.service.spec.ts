import { TestBed } from '@angular/core/testing';

import { MachineTassTypeService } from './machine-tass-type.service';

describe('MachineTassTypeService', () => {
  let service: MachineTassTypeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MachineTassTypeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
