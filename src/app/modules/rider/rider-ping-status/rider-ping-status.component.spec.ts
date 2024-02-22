import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RiderPingStatusComponent } from './rider-ping-status.component';

describe('RiderPingStatusComponent', () => {
  let component: RiderPingStatusComponent;
  let fixture: ComponentFixture<RiderPingStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RiderPingStatusComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RiderPingStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
