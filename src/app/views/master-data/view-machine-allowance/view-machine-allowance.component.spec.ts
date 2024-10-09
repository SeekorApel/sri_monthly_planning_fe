import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewMachineAllowanceComponent } from './view-machine-allowance.component';

describe('VieaMachineAllowanceComponent', () => {
  let component: ViewMachineAllowanceComponent;
  let fixture: ComponentFixture<ViewMachineAllowanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewMachineAllowanceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewMachineAllowanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
