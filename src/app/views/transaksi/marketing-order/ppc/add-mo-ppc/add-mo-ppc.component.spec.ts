import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMoPpcComponent } from './add-mo-ppc.component';

describe('AddMoPpcComponent', () => {
  let component: AddMoPpcComponent;
  let fixture: ComponentFixture<AddMoPpcComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddMoPpcComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddMoPpcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
