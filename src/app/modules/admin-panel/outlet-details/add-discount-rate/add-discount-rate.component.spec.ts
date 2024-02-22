import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDiscountRateComponent } from './add-discount-rate.component';

describe('AddDiscountRateComponent', () => {
  let component: AddDiscountRateComponent;
  let fixture: ComponentFixture<AddDiscountRateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddDiscountRateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddDiscountRateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
