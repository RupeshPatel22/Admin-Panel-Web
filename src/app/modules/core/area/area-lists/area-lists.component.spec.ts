/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { AreaListsComponent } from './area-lists.component';
describe('AreaListsComponent', () => {
  let component: AreaListsComponent;
  let fixture: ComponentFixture<AreaListsComponent>;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AreaListsComponent]
    })
      .compileComponents();
  }));
  beforeEach(() => {
    fixture = TestBed.createComponent(AreaListsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
