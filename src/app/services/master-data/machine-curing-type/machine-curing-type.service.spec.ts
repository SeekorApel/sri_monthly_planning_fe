import { TestBed } from '@angular/core/testing';

import { MachineCuringTypeService } from './machine-curing-type.service';

describe('MachineCuringTypeService', () => {
  let service: MachineCuringTypeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MachineCuringTypeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
