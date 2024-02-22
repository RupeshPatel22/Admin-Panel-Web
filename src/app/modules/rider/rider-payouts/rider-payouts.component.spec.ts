import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RiderPayoutsComponent } from './rider-payouts.component';

describe('RiderPayoutsComponent', () => {
  let component: RiderPayoutsComponent;
  let fixture: ComponentFixture<RiderPayoutsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RiderPayoutsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RiderPayoutsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
