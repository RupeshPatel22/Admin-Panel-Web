import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GlobalVarDialogComponent } from './global-var-dialog.component';

describe('GlobalVarDialogComponent', () => {
  let component: GlobalVarDialogComponent;
  let fixture: ComponentFixture<GlobalVarDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GlobalVarDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GlobalVarDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
