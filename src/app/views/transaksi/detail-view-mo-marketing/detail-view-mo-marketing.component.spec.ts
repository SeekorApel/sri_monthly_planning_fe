import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailViewMoMarketingComponent } from './detail-view-mo-marketing.component';

describe('DetailViewMoMarketingComponent', () => {
  let component: DetailViewMoMarketingComponent;
  let fixture: ComponentFixture<DetailViewMoMarketingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailViewMoMarketingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailViewMoMarketingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
