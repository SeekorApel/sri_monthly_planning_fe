import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewMachineCuringTypeComponent } from './view-machine-curing-type.component';

describe('ViewPatternComponent', () => {
  let component: ViewMachineCuringTypeComponent;
  let fixture: ComponentFixture<ViewMachineCuringTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ViewMachineCuringTypeComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewMachineCuringTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});