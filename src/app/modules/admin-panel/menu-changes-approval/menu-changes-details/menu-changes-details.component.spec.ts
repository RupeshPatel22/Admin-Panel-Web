import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MenuChangesDetailsComponent } from './menu-changes-details.component';
describe('MenuChangesDetailsComponent', () => {
  let component: MenuChangesDetailsComponent;
  let fixture: ComponentFixture<MenuChangesDetailsComponent>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MenuChangesDetailsComponent]
    })
      .compileComponents();
  });
  beforeEach(() => {
    fixture = TestBed.createComponent(MenuChangesDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
