import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewHeaderMoComponent } from './view-header-mo.component';

describe('ViewHeaderMoComponent', () => {
  let component: ViewHeaderMoComponent;
  let fixture: ComponentFixture<ViewHeaderMoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewHeaderMoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewHeaderMoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
