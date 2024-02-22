import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartnerUsersComponent } from './partner-users.component';

describe('PartnerUsersComponent', () => {
  let component: PartnerUsersComponent;
  let fixture: ComponentFixture<PartnerUsersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PartnerUsersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PartnerUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
