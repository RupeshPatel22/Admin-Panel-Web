import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PndMerchantDetailsComponent } from './pnd-merchant-details.component';

describe('PndMerchantDetailsComponent', () => {
  let component: PndMerchantDetailsComponent;
  let fixture: ComponentFixture<PndMerchantDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PndMerchantDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PndMerchantDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
