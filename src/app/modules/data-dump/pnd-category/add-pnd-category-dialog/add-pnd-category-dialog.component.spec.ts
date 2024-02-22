import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPndCategoryDialogComponent } from './add-pnd-category-dialog.component';

describe('AddPndCategoryDialogComponent', () => {
  let component: AddPndCategoryDialogComponent;
  let fixture: ComponentFixture<AddPndCategoryDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddPndCategoryDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddPndCategoryDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
