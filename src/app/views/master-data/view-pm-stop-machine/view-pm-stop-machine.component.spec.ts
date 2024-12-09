import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewPmStopMachineComponent } from './view-pm-stop-machine.component';

describe('ViewPmStopMachineComponent', () => {
  let component: ViewPmStopMachineComponent;
  let fixture: ComponentFixture<ViewPmStopMachineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ViewPmStopMachineComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewPmStopMachineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
