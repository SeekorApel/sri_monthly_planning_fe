import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewItemAssyComponent } from './view-item-assy.component';

describe('ViewItemAssyComponent', () => {
  let component: ViewItemAssyComponent;
  let fixture: ComponentFixture<ViewItemAssyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewItemAssyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewItemAssyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
