import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewCtKapaComponent } from './view-ct-kapa.component';

describe('ViewCtKapaComponent', () => {
  let component: ViewCtKapaComponent;
  let fixture: ComponentFixture<ViewCtKapaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewCtKapaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewCtKapaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
