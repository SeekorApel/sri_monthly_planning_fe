import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewRoutingMachineComponent } from './view-routing-machine.component';

describe('ViewRoutingMachineComponent', () => {
  let component: ViewRoutingMachineComponent;
  let fixture: ComponentFixture<ViewRoutingMachineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewRoutingMachineComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewRoutingMachineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
