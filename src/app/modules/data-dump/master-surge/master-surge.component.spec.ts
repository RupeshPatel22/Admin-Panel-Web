import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MasterSurgeComponent } from './master-surge.component';

describe('MasterSurgeComponent', () => {
  let component: MasterSurgeComponent;
  let fixture: ComponentFixture<MasterSurgeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MasterSurgeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MasterSurgeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
