import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddArDefactRejectComponent } from './add-ar-defact-reject.component';

describe('AddArDefactRejectComponent', () => {
  let component: AddArDefactRejectComponent;
  let fixture: ComponentFixture<AddArDefactRejectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddArDefactRejectComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddArDefactRejectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
