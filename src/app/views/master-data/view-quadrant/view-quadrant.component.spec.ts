import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewQuadrantComponent } from './view-quadrant.component';

describe('ViewQuadrantComponent', () => {
  let component: ViewQuadrantComponent;
  let fixture: ComponentFixture<ViewQuadrantComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewQuadrantComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewQuadrantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
