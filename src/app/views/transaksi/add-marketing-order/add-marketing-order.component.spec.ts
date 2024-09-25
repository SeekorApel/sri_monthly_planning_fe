import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMarketingOrderComponent } from './add-marketing-order.component';

describe('AddMarketingOrderComponent', () => {
  let component: AddMarketingOrderComponent;
  let fixture: ComponentFixture<AddMarketingOrderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddMarketingOrderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddMarketingOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
