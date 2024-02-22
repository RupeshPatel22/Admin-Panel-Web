import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewItemModalComponent } from './add-new-item-modal.component';

describe('AddNewItemModalComponent', () => {
  let component: AddNewItemModalComponent;
  let fixture: ComponentFixture<AddNewItemModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddNewItemModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddNewItemModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
