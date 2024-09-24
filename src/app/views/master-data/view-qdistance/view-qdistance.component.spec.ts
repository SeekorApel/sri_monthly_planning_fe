import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewQDistanceComponent } from './view-qdistance.component';

describe('ViewQDistanceComponent', () => {
  let component: ViewQDistanceComponent;
  let fixture: ComponentFixture<ViewQDistanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewQDistanceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewQDistanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
