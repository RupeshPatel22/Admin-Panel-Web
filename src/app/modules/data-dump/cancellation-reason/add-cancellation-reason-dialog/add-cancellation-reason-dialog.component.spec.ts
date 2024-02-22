import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCancellationReasonDialogComponent } from './add-cancellation-reason-dialog.component';

describe('AddCancellationReasonDialogComponent', () => {
  let component: AddCancellationReasonDialogComponent;
  let fixture: ComponentFixture<AddCancellationReasonDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddCancellationReasonDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddCancellationReasonDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
