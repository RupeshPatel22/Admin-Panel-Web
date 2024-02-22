import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PndMerchantComponent } from './pnd-merchant.component';

describe('PndMerchantComponent', () => {
  let component: PndMerchantComponent;
  let fixture: ComponentFixture<PndMerchantComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PndMerchantComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PndMerchantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
