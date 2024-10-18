import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewMoMarketingComponent } from './view-mo-marketing.component';

describe('ViewMoMarketingComponent', () => {
  let component: ViewMoMarketingComponent;
  let fixture: ComponentFixture<ViewMoMarketingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewMoMarketingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewMoMarketingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
