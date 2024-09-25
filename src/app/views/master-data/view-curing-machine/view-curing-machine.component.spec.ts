import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewCuringMachineComponent } from './view-curing-machine.component';

describe('ViewCuringMachineComponent', () => {
  let component: ViewCuringMachineComponent;
  let fixture: ComponentFixture<ViewCuringMachineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewCuringMachineComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewCuringMachineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
