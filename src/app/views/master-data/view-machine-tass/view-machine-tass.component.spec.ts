import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewMachineTassComponent } from './view-machine-tass.component';

describe('ViewTassmachineComponent', () => {
  let component: ViewMachineTassComponent;
  let fixture: ComponentFixture<ViewMachineTassComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ViewMachineTassComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewMachineTassComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
