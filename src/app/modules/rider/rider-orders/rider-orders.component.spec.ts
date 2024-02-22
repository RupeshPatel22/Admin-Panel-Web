import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RiderOrdersComponent } from './rider-orders.component';

describe('RiderOrdersComponent', () => {
  let component: RiderOrdersComponent;
  let fixture: ComponentFixture<RiderOrdersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RiderOrdersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RiderOrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
