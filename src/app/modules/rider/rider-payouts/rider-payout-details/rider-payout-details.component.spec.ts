import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RiderPayoutDetailsComponent } from './rider-payout-details.component';

describe('RiderPayoutDetailsComponent', () => {
  let component: RiderPayoutDetailsComponent;
  let fixture: ComponentFixture<RiderPayoutDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RiderPayoutDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RiderPayoutDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
