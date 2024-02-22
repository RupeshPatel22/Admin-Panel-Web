import { Component, Input, OnInit } from '@angular/core';
import { InquiryOrderDetails } from '../../model/inquiry-orders';
import { OrdersService } from 'src/app/shared/services/orders.service';

@Component({
  selector: 'app-inquiry-orders-details',
  templateUrl: './inquiry-orders-details.component.html',
  styleUrls: ['./inquiry-orders-details.component.scss']
})
export class InquiryOrdersDetailsComponent implements OnInit {

  @Input() inquiryOrderId: number;
  inquiryOrderDetails: InquiryOrderDetails;

  constructor( private orderService: OrdersService) { }

  ngOnInit(): void {
    this.getInquiryOrderDetails();
  }

  
  /**
 * Method that retrieves details of a specific inquiry order using the InquiryOrderDetails service and updates the component state.
 */
  getInquiryOrderDetails() {
    this.orderService.getInquiryOrderDetails(this.inquiryOrderId).subscribe(res => {
      this.inquiryOrderDetails = InquiryOrderDetails.fromJson(res.result)
    });
  }

}
