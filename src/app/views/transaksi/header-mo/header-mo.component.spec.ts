import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderMoComponent } from './header-mo.component';

describe('HeaderMoComponent', () => {
  let component: HeaderMoComponent;
  let fixture: ComponentFixture<HeaderMoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HeaderMoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderMoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
