import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OperationalCityComponent } from './operational-city.component';

describe('OperationalCityComponent', () => {
  let component: OperationalCityComponent;
  let fixture: ComponentFixture<OperationalCityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OperationalCityComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OperationalCityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
