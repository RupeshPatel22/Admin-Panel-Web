import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PayoutDetailsComponent } from './payout-details.component';
describe('PayoutDetailsComponent', () => {
  let component: PayoutDetailsComponent;
  let fixture: ComponentFixture<PayoutDetailsComponent>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PayoutDetailsComponent]
    })
      .compileComponents();
  });
  beforeEach(() => {
    fixture = TestBed.createComponent(PayoutDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
