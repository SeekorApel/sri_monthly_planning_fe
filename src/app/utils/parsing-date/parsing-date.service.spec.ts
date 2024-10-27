import { TestBed } from '@angular/core/testing';

import { ParsingDateService } from './parsing-date.service';

describe('ParsingDateService', () => {
  let service: ParsingDateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ParsingDateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
