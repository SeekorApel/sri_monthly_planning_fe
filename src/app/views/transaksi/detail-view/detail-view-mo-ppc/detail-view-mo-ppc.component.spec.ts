import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailViewMoPpcComponent } from './detail-view-mo-ppc.component';

describe('DetailViewMoPpcComponent', () => {
  let component: DetailViewMoPpcComponent;
  let fixture: ComponentFixture<DetailViewMoPpcComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailViewMoPpcComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailViewMoPpcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
