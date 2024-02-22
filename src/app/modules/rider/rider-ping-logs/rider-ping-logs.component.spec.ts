import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RiderPingLogsComponent } from './rider-ping-logs.component';

describe('RiderPingLogsComponent', () => {
  let component: RiderPingLogsComponent;
  let fixture: ComponentFixture<RiderPingLogsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RiderPingLogsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RiderPingLogsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
