import { TestBed } from '@angular/core/testing';

import { MachineTassService } from './tassMachine.service';

describe('PatternService', () => {
  let service: MachineTassService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MachineTassService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
