import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OperationalZoneComponent } from './operational-zone.component';

describe('OperationalZoneComponent', () => {
  let component: OperationalZoneComponent;
  let fixture: ComponentFixture<OperationalZoneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OperationalZoneComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OperationalZoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
