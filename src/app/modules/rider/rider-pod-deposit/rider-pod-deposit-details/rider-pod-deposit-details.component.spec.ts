import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RiderPodDepositDetailsComponent } from './rider-pod-deposit-details.component';

describe('RiderPodDepositDetailsComponent', () => {
  let component: RiderPodDepositDetailsComponent;
  let fixture: ComponentFixture<RiderPodDepositDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RiderPodDepositDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RiderPodDepositDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
