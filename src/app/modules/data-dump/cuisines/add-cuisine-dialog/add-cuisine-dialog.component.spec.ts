import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCuisineDialogComponent } from './add-cuisine-dialog.component';

describe('AddCuisineDialogComponent', () => {
  let component: AddCuisineDialogComponent;
  let fixture: ComponentFixture<AddCuisineDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddCuisineDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddCuisineDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
