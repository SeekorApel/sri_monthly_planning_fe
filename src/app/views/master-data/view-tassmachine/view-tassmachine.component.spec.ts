import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewTassMachine } from './view-tassmachine.component';

describe('ViewTassmachineComponent', () => {
  let component: ViewTassMachine;
  let fixture: ComponentFixture<ViewTassMachine>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewTassMachine ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewTassMachine);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
