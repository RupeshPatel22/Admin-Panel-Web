import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMasterCategoryDialogComponent } from './add-master-category-dialog.component';

describe('AddMasterCategoryDialogComponent', () => {
  let component: AddMasterCategoryDialogComponent;
  let fixture: ComponentFixture<AddMasterCategoryDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddMasterCategoryDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddMasterCategoryDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
