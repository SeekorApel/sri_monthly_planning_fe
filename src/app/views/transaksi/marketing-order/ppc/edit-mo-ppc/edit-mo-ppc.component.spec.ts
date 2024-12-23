import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditMoPpcComponent } from './edit-mo-ppc.component';

describe('EditMoPpcComponent', () => {
  let component: EditMoPpcComponent;
  let fixture: ComponentFixture<EditMoPpcComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditMoPpcComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditMoPpcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
