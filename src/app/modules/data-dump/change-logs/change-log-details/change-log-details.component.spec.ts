import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeLogDetailsComponent } from './change-log-details.component';

describe('ChangeLogDetailsComponent', () => {
  let component: ChangeLogDetailsComponent;
  let fixture: ComponentFixture<ChangeLogDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChangeLogDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeLogDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
