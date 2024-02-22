import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RiderShiftsComponent } from './rider-shifts.component';

describe('RiderShiftsComponent', () => {
  let component: RiderShiftsComponent;
  let fixture: ComponentFixture<RiderShiftsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RiderShiftsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RiderShiftsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
