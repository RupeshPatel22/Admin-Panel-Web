import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OperationalCityListComponent } from './operational-city-list.component';

describe('OperationalCityListComponent', () => {
  let component: OperationalCityListComponent;
  let fixture: ComponentFixture<OperationalCityListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OperationalCityListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OperationalCityListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
