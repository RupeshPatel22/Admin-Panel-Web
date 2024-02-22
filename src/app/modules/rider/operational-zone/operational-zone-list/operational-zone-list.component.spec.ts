import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OperationalZoneListComponent } from './operational-zone-list.component';

describe('OperationalZoneListComponent', () => {
  let component: OperationalZoneListComponent;
  let fixture: ComponentFixture<OperationalZoneListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OperationalZoneListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OperationalZoneListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
