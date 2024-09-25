import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewMaxCapacityComponent } from './view-max-capacity.component';

describe('ViewMaxCapacityComponent', () => {
  let component: ViewMaxCapacityComponent;
  let fixture: ComponentFixture<ViewMaxCapacityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewMaxCapacityComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewMaxCapacityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
