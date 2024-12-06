import { TestBed } from '@angular/core/testing';

import { ParsingNumberService } from './parsing-number.service';

describe('ParsingNumberService', () => {
  let service: ParsingNumberService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ParsingNumberService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
