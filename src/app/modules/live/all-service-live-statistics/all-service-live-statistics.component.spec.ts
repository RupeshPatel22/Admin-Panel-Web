import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllServiceLiveStatisticsComponent } from './all-service-live-statistics.component';

describe('AllServiceLiveStatisticsComponent', () => {
  let component: AllServiceLiveStatisticsComponent;
  let fixture: ComponentFixture<AllServiceLiveStatisticsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllServiceLiveStatisticsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AllServiceLiveStatisticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
