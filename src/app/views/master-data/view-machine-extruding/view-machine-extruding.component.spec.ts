import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewMachineExtrudingComponent } from './view-machine-extruding.component';

describe('ViewMachineExtrudingComponent', () => {
  let component: ViewMachineExtrudingComponent;
  let fixture: ComponentFixture<ViewMachineExtrudingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ViewMachineExtrudingComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewMachineExtrudingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});