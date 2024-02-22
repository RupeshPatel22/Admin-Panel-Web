import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RiderPodCollectionsDetailsComponent } from './rider-pod-collections-details.component';

describe('RiderPodCollectionsDetailsComponent', () => {
  let component: RiderPodCollectionsDetailsComponent;
  let fixture: ComponentFixture<RiderPodCollectionsDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RiderPodCollectionsDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RiderPodCollectionsDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
