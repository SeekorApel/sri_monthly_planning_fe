import { TestBed } from '@angular/core/testing';

import { SizeService } from './tass-size.service';

describe('PlantService', () => {
  let service: SizeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SizeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
