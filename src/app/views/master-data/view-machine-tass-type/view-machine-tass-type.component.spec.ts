import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewMachineTassTypeComponent } from './view-machine-tass-type.component';

describe('ViewMachineTassTypeComponent', () => {
  let component: ViewMachineTassTypeComponent;
  let fixture: ComponentFixture<ViewMachineTassTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ViewMachineTassTypeComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewMachineTassTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});