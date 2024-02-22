import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorUsersComponent } from './vendor-users.component';

describe('VendorUsersComponent', () => {
  let component: VendorUsersComponent;
  let fixture: ComponentFixture<VendorUsersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VendorUsersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VendorUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
