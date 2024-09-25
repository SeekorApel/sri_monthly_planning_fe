import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewMachineCuringTypeCavityComponent } from './view-machine-curing-type-cavity.component';

describe('ViewMachineCuringTypeCavityComponent', () => {
  let component: ViewMachineCuringTypeCavityComponent;
  let fixture: ComponentFixture<ViewMachineCuringTypeCavityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ViewMachineCuringTypeCavityComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewMachineCuringTypeCavityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
