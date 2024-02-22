import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlackZoneListComponent } from './black-zone-list.component';

describe('BlackZoneListComponent', () => {
  let component: BlackZoneListComponent;
  let fixture: ComponentFixture<BlackZoneListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BlackZoneListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BlackZoneListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
