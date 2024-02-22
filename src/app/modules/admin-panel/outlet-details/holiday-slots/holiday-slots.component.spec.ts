import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HolidaySlotsComponent } from './holiday-slots.component';

describe('HolidaySlotsComponent', () => {
  let component: HolidaySlotsComponent;
  let fixture: ComponentFixture<HolidaySlotsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HolidaySlotsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HolidaySlotsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
