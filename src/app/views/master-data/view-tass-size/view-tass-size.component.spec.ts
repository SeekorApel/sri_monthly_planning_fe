import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewTassSizeComponent } from './view-tass-size.component';

describe('ViewTassSizeComponent', () => {
  let component: ViewTassSizeComponent;
  let fixture: ComponentFixture<ViewTassSizeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewTassSizeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewTassSizeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
