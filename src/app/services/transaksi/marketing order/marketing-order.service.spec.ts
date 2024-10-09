import { TestBed } from '@angular/core/testing';

import { MarketingOrderService } from './marketing-order.service';

describe('MarketingOrderService', () => {
  let service: MarketingOrderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MarketingOrderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
