import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMoMarketingComponent } from './add-mo-marketing.component';

describe('AddMoMarketingComponent', () => {
  let component: AddMoMarketingComponent;
  let fixture: ComponentFixture<AddMoMarketingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddMoMarketingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddMoMarketingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
