import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OutletDialogComponent } from './outlet-dialog.component';

describe('OutletDialogComponent', () => {
  let component: OutletDialogComponent;
  let fixture: ComponentFixture<OutletDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OutletDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OutletDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
