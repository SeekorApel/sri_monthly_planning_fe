import { TestBed } from '@angular/core/testing';

import { TassMachineService } from './tassMachine.service';

describe('PatternService', () => {
  let service: TassMachineService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TassMachineService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
