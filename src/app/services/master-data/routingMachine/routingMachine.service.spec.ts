import { TestBed } from '@angular/core/testing';

import { RoutingMachineService } from './routingMachine.service';

describe('RoutingMachineService', () => {
  let service: RoutingMachineService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RoutingMachineService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
