import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditMoMarketingComponent } from './edit-mo-marketing.component';

describe('EditMoMarketingComponent', () => {
  let component: EditMoMarketingComponent;
  let fixture: ComponentFixture<EditMoMarketingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditMoMarketingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditMoMarketingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
