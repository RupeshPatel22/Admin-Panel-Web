import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CatalogApprovalComponent } from './catalog-approval.component';
describe('CatalogApprovalComponent', () => {
  let component: CatalogApprovalComponent;
  let fixture: ComponentFixture<CatalogApprovalComponent>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CatalogApprovalComponent]
    })
      .compileComponents();
  });
  beforeEach(() => {
    fixture = TestBed.createComponent(CatalogApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
