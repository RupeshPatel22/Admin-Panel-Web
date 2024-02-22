import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MenuCloningComponent } from './menu-cloning.component';
describe('MenuCloningComponent', () => {
  let component: MenuCloningComponent;
  let fixture: ComponentFixture<MenuCloningComponent>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MenuCloningComponent]
    })
      .compileComponents();
  });
  beforeEach(() => {
    fixture = TestBed.createComponent(MenuCloningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
