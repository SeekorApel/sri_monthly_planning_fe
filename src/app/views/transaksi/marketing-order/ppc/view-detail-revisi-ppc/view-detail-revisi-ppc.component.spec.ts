import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewDetailRevisiPpcComponent } from './view-detail-revisi-ppc.component';

describe('ViewDetailRevisiPpcComponent', () => {
  let component: ViewDetailRevisiPpcComponent;
  let fixture: ComponentFixture<ViewDetailRevisiPpcComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewDetailRevisiPpcComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewDetailRevisiPpcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
