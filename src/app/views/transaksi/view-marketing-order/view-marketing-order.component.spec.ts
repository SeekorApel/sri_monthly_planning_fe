import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewMarketingOrderComponent } from './view-marketing-order.component';

describe('ViewMarketingOrderComponent', () => {
  let component: ViewMarketingOrderComponent;
  let fixture: ComponentFixture<ViewMarketingOrderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewMarketingOrderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewMarketingOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
