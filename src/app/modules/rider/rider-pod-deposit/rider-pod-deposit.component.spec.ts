import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RiderPodDepositComponent } from './rider-pod-deposit.component';

describe('RiderPodDepositComponent', () => {
  let component: RiderPodDepositComponent;
  let fixture: ComponentFixture<RiderPodDepositComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RiderPodDepositComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RiderPodDepositComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
