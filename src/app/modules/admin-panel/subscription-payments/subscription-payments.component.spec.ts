import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SubscriptionPaymentsComponent } from './subscription-payments.component';
describe('SubscriptionPaymentsComponent', () => {
  let component: SubscriptionPaymentsComponent;
  let fixture: ComponentFixture<SubscriptionPaymentsComponent>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SubscriptionPaymentsComponent]
    })
      .compileComponents();
  });
  beforeEach(() => {
    fixture = TestBed.createComponent(SubscriptionPaymentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
