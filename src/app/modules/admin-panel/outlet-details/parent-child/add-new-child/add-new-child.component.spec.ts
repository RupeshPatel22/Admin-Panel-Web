import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewChildComponent } from './add-new-child.component';

describe('AddNewChildComponent', () => {
  let component: AddNewChildComponent;
  let fixture: ComponentFixture<AddNewChildComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddNewChildComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddNewChildComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
