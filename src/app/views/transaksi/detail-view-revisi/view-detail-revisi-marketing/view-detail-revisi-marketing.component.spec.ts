import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewDetailRevisiMarketingComponent } from './view-detail-revisi-marketing.component';

describe('ViewDetailRevisiMarketingComponent', () => {
  let component: ViewDetailRevisiMarketingComponent;
  let fixture: ComponentFixture<ViewDetailRevisiMarketingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewDetailRevisiMarketingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewDetailRevisiMarketingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
