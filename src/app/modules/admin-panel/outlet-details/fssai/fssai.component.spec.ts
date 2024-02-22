import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FssaiComponent } from './fssai.component';

describe('FssaiComponent', () => {
  let component: FssaiComponent;
  let fixture: ComponentFixture<FssaiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FssaiComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FssaiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
