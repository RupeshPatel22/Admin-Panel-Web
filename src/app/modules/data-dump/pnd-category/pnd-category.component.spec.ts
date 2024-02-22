import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PndCategoryComponent } from './pnd-category.component';

describe('PndCategoryComponent', () => {
  let component: PndCategoryComponent;
  let fixture: ComponentFixture<PndCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PndCategoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PndCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
