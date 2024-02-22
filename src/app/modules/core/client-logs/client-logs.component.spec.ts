import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientLogsComponent } from './client-logs.component';

describe('ClientLogsComponent', () => {
  let component: ClientLogsComponent;
  let fixture: ComponentFixture<ClientLogsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClientLogsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientLogsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
