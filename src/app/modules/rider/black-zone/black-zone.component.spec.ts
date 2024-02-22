import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlackZoneComponent } from './black-zone.component';

describe('BlackZoneComponent', () => {
  let component: BlackZoneComponent;
  let fixture: ComponentFixture<BlackZoneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BlackZoneComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BlackZoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
