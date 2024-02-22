import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GlobalVarComponent } from './global-var.component';

describe('GlobalVarComponent', () => {
  let component: GlobalVarComponent;
  let fixture: ComponentFixture<GlobalVarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GlobalVarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GlobalVarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
