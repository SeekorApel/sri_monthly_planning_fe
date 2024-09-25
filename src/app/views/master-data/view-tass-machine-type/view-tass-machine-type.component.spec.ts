import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewTassMachineTypeComponent } from './view-tass-machine-type.component';

describe('ViewTassMachineTypeComponent', () => {
  let component: ViewTassMachineTypeComponent;
  let fixture: ComponentFixture<ViewTassMachineTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewTassMachineTypeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewTassMachineTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
