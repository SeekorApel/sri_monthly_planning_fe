import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DagangDurenComponent } from './dagang-duren.component';

describe('DagangDurenComponent', () => {
  let component: DagangDurenComponent;
  let fixture: ComponentFixture<DagangDurenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DagangDurenComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DagangDurenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
