import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewCuringSizeComponent } from './view-curing-size.component';

describe('ViewCuringSizeComponent', () => {
  let component: ViewCuringSizeComponent;
  let fixture: ComponentFixture<ViewCuringSizeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewCuringSizeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewCuringSizeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
