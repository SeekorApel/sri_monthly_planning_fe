import { TestBed } from '@angular/core/testing';

import { FrontRearService } from './front-rear.service';

describe('FrontRearService', () => {
  let service: FrontRearService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FrontRearService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
