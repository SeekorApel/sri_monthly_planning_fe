import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewPlantComponent } from './view-plant.component';

describe('ViewPlantComponent', () => {
  let component: ViewPlantComponent;
  let fixture: ComponentFixture<ViewPlantComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewPlantComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewPlantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
