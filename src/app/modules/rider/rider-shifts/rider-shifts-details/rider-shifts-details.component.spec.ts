import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RiderShiftsDetailsComponent } from './rider-shifts-details.component';

describe('RiderShiftsDetailsComponent', () => {
  let component: RiderShiftsDetailsComponent;
  let fixture: ComponentFixture<RiderShiftsDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RiderShiftsDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RiderShiftsDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
