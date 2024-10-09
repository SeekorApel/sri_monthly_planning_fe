import { TestBed } from '@angular/core/testing';

import { ItemAssyService } from './itemAssy.service';

describe('ItemAssyService', () => {
  let service: ItemAssyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ItemAssyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
