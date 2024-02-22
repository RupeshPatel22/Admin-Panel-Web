import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HolidaySlotsActionDialogComponent } from './holiday-slots-action-dialog.component';

describe('HolidaySlotsActionDialogComponent', () => {
  let component: HolidaySlotsActionDialogComponent;
  let fixture: ComponentFixture<HolidaySlotsActionDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HolidaySlotsActionDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HolidaySlotsActionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
