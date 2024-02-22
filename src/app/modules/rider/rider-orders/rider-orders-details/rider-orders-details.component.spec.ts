import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RiderOrdersDetailsComponent } from './rider-orders-details.component';

describe('RiderOrdersDetailsComponent', () => {
  let component: RiderOrdersDetailsComponent;
  let fixture: ComponentFixture<RiderOrdersDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RiderOrdersDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RiderOrdersDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
