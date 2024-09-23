import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddHeaderMoComponent } from './add-header-mo.component';

describe('AddHeaderMoComponent', () => {
  let component: AddHeaderMoComponent;
  let fixture: ComponentFixture<AddHeaderMoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddHeaderMoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddHeaderMoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
