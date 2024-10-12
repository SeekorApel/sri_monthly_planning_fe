import { TestBed } from '@angular/core/testing';

import { CtKapaService } from './ctkapa.service';

describe('CtKapaService', () => {
  let service: CtKapaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CtKapaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
