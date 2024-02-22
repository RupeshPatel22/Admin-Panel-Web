import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MenuChangesApprovalComponent } from './menu-changes-approval.component';
describe('MenuChangesApprovalComponent', () => {
  let component: MenuChangesApprovalComponent;
  let fixture: ComponentFixture<MenuChangesApprovalComponent>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MenuChangesApprovalComponent]
    })
      .compileComponents();
  });
  beforeEach(() => {
    fixture = TestBed.createComponent(MenuChangesApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
