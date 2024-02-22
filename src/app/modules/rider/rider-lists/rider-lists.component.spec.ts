import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RiderListsComponent } from './rider-lists.component';

describe('RiderListsComponent', () => {
  let component: RiderListsComponent;
  let fixture: ComponentFixture<RiderListsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RiderListsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RiderListsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
