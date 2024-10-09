import { TestBed } from '@angular/core/testing';

import { CTCuringService } from './ct-curing.service';

describe('CTCuringService', () => {
  let service: CTCuringService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CTCuringService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
