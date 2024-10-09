import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewCtCuringComponent } from './view-ct-curing.component';

describe('ViewCtCuringComponent', () => {
  let component: ViewCtCuringComponent;
  let fixture: ComponentFixture<ViewCtCuringComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewCtCuringComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewCtCuringComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
