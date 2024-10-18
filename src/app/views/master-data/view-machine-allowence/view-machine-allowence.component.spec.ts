import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewMachineAllowenceComponent } from './view-machine-allowence.component';

describe('ViewMachineAllowenceComponent', () => {
  let component: ViewMachineAllowenceComponent;
  let fixture: ComponentFixture<ViewMachineAllowenceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewMachineAllowenceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewMachineAllowenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
