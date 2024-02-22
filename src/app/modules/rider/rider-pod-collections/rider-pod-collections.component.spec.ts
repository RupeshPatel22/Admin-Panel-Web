import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RiderPodCollectionsComponent } from './rider-pod-collections.component';

describe('RiderPodCollectionsComponent', () => {
  let component: RiderPodCollectionsComponent;
  let fixture: ComponentFixture<RiderPodCollectionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RiderPodCollectionsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RiderPodCollectionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
