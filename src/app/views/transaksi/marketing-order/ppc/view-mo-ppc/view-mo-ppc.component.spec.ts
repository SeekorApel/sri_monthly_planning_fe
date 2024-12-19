import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewMoPpcComponent } from './view-mo-ppc.component';

describe('ViewMoPpcComponent', () => {
  let component: ViewMoPpcComponent;
  let fixture: ComponentFixture<ViewMoPpcComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewMoPpcComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewMoPpcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
