import { Component, Input, OnInit } from '@angular/core';
import { SubscriptionPayment } from '../model/subscription-payment';
@Component({
  selector: 'app-payment-details',
  templateUrl: './payment-details.component.html',
  styleUrls: ['./payment-details.component.scss']
})
export class PaymentDetailsComponent implements OnInit {
  @Input() paymentDetails: SubscriptionPayment;
  constructor() { }
  ngOnInit(): void {
  }
}
