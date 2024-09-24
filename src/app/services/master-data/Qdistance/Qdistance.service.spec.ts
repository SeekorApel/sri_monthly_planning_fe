import { TestBed } from '@angular/core/testing';

import { QDistanceService } from './Qdistance.service';

describe('PlantService', () => {
  let service: QDistanceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(QDistanceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
