import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMoFrontRearComponent } from './add-mo-front-rear.component';

describe('AddMoFrontRearComponent', () => {
  let component: AddMoFrontRearComponent;
  let fixture: ComponentFixture<AddMoFrontRearComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddMoFrontRearComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddMoFrontRearComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
