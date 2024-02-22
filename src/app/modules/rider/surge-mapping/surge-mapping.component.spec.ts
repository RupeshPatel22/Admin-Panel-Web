import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SurgeMappingComponent } from './surge-mapping.component';

describe('SurgeMappingComponent', () => {
  let component: SurgeMappingComponent;
  let fixture: ComponentFixture<SurgeMappingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SurgeMappingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SurgeMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
