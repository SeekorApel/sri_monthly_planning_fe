import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewBDistanceComponent } from './view-bdistance.component';

describe('ViewBDistanceComponent', () => {
  let component: ViewBDistanceComponent;
  let fixture: ComponentFixture<ViewBDistanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewBDistanceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewBDistanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
