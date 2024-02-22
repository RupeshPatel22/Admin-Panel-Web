import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InquiryOrdersDetailsComponent } from './inquiry-orders-details.component';

describe('InquiryOrdersDetailsComponent', () => {
  let component: InquiryOrdersDetailsComponent;
  let fixture: ComponentFixture<InquiryOrdersDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InquiryOrdersDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InquiryOrdersDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
