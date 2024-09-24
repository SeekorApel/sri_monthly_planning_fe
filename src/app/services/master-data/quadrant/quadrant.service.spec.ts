import { TestBed } from '@angular/core/testing';

import { QuadrantService } from './quadrant.service';

describe('QuadrantService', () => {
  let service: QuadrantService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(QuadrantService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
