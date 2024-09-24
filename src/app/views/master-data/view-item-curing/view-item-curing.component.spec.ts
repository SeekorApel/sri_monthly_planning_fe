import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewItemCuringComponent } from './view-item-curing.component';

describe('ViewItemCuringComponent', () => {
  let component: ViewItemCuringComponent;
  let fixture: ComponentFixture<ViewItemCuringComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewItemCuringComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewItemCuringComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
