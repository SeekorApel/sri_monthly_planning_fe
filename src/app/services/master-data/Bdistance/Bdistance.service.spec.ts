import { TestBed } from '@angular/core/testing';

import { BDistanceService } from './Bdistance.service';

describe('PlantService', () => {
  let service: BDistanceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BDistanceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
