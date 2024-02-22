import { Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ConfirmationDialogComponent } from 'src/app/shared/components/confirmation-dialog/confirmation-dialog.component';
import { CityAreaService } from 'src/app/shared/services/city-area.service';
import { OutletsService } from 'src/app/shared/services/outlets.service';
import { Services, pageSize, pageSizeOptions } from 'src/app/shared/models/constants/constant.type';
import { FilterOutlet, Outlet } from '../outlets/model/outlet';
import { ToastService } from 'src/app/shared/services/toast.service';
@Component({
  selector: 'app-catalog-approval',
  templateUrl: './catalog-approval.component.html',
  styleUrls: ['./catalog-approval.component.scss']
})
export class CatalogApprovalComponent implements OnInit {
  outletsList: MatTableDataSource<Outlet> = new MatTableDataSource();
  showFilterFields: boolean;
  totalOutletRecords: number;
  pageIndex: number = 0;
  pageSize: number = pageSize;
  pageSizeOptions = pageSizeOptions;
  displayedColumns = ['sr no', 'image', 'name', 'area', 'city', 'menu details', 'upload data', 'approved by', 'catalogue approval'];
  showMenuItemDetailsModal: boolean;
  showUploadDataModal: boolean;
  cityList: any[] = [];
  areaList: any[] = [];
  filterOutletFields: FilterOutlet = new FilterOutlet();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  menuItemForm = new FormGroup({
    packingChargeType: new FormControl(''),
    orderLevelPackagingCharges: new FormControl(''),
    customItemLevalPackagingCharges: new FormControl(),
    itemRows: this.formBuilder.array([]),
    menuRows: this.formBuilder.array([this.initMenuRows()]),
  })
  readonly Services = Services;
  service: string;

  constructor(private outletsService: OutletsService, private dialog: MatDialog, private formBuilder: FormBuilder,
    private router: Router, private cityAreaService: CityAreaService, private toastMsgService: ToastService) { }

  ngOnInit(): void {
    this.setCityList();
    this.getOutletsList();
    this.service = this.outletsService.service;
  }
  setCityList() {
    this.cityAreaService.getCityList().subscribe(res => {
      this.cityList = [];
      for (const c of res['result']) {
        this.cityList.push(c);
      }
    })
  }
  setAreaList() {
    if (!this.filterOutletFields.cityId) {
      return
    }
    const data = {
      filter: {
        city_ids: [this.filterOutletFields.cityId]
      }
    }
    this.cityAreaService.postFilterAreaPolygon(data).subscribe(res => {
      this.areaList = [];
      this.filterOutletFields.areaIds = [];
      for (const c of res['result']) {
        this.areaList.push(c);
      }
    })
  }
  /**
   * Method that gets all outlets with status: catalogPending 
   */
  getOutletsList(filterFlag?: boolean) {
    if (filterFlag) {
      this.pageIndex = 0;
      this.paginator.pageIndex = 0;
    }
    this.filterOutletFields.status = 'catalogPending'; // want to filter outlets only having this status
    this.filterOutletFields.pageIndex = this.pageIndex;
    this.filterOutletFields.pageSize = this.pageSize;
    const data = this.filterOutletFields.toJson();
    
    this.outletsService.getAllOutlets(data).subscribe(res => {
      this.totalOutletRecords = res['result']['total_records'];
      this.outletsList.data = [];
      res['result']['restaurants']?.forEach(outlet => {
        this.outletsList.data.push(Outlet.fromJson(outlet, this.service))
      })
      res['result']['stores']?.forEach(outlet => {
        this.outletsList.data.push(Outlet.fromJson(outlet, this.service))
      })
      res['result']['outlets']?.forEach(outlet => {
        this.outletsList.data.push(Outlet.fromJson(outlet, this.service))
      })
      this.outletsList.sort = this.sort;
    })
  }
  onPageChange(event) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.getOutletsList();
  }
  clearFilter(fieldName?: 'all') {
    if (fieldName === 'all') {
      this.showFilterFields = false;
      this.filterOutletFields = new FilterOutlet();
    }
    this.getOutletsList()
  }
  /**
   * Method that approves catalog of outlet
   * @param outletId 
   * @param outletName 
   */
  approveCatalog(outletId: string, outletName: string) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        title: 'Are you sure ?',
        message: `Do you want to approve the outlet: ${outletName}?`,
        confirmBtnText: 'OK',
        dismissBtnText: 'Cancel'
      }
    })
    dialogRef.afterClosed().subscribe(response => {
      if (response) {
        this.outletsService.catalogApproval(outletId).subscribe(res => {
          if (this.outletsList.data.length === 1 && this.pageIndex > 0) {
            this.pageIndex -= 1;
            this.paginator.pageIndex = this.pageIndex;
          }
          this.getOutletsList();
        })
      }
    })
  }
  openMenuItemDetailsModal(outlet: Outlet) {
    this.showMenuItemDetailsModal = true;
    this.menuItemForm.patchValue({
      packingChargeType: outlet.packagingChargesType,
      orderLevelPackagingCharges: outlet.orderLevelPackagingCharges,
      customItemLevalPackagingCharges: outlet.customItemLevalPackagingCharges
    })
    this.itemArr.clear();
    if (outlet.packagingChargesType === 'item' && outlet.customItemLevalPackagingCharges) {
      outlet.itemRows.forEach((item, i) => {
        this.addItem();
        this.itemArr.at(i).patchValue({ ...item })
      })
    }
    if (outlet.menuRows) {
      this.menuArr.clear();
      outlet.menuRows.forEach((menu, i) => {
        this.addMenu();
        this.menuArr.at(i).patchValue({ ...menu })
      })
    }
    this.menuItemForm.disable();
  }
  closeMenuItemDetailsModal() {
    this.showMenuItemDetailsModal = false;
  }
  get itemArr() {
    return this.menuItemForm.get('itemRows') as FormArray;
  }
  /**
 * Method that creates new formGroup for item array
 * @returns formGroup
 */
  initItemRows() {
    return this.formBuilder.group({
      itemName: new FormControl(''),
      itemPrice: new FormControl(''),
      itemPackagingCharges: new FormControl(''),
      itemDoc: new FormControl(''),
      itemDocUrl: new FormControl()
    });
  }
  /**
* Method that adds newly created formGroup to the formArray 
*/
  addItem() {
    this.itemArr.push(this.initItemRows());
  }
  get menuArr() {
    return this.menuItemForm.get('menuRows') as FormArray;
  }
  /**
   * Method that creates new formGroup for menu array
   * @returns formGroup
   */
  initMenuRows() {
    return this.formBuilder.group({
      menuDoc: new FormControl(''),
      menuDocUrl: new FormControl()
    });
  }
  /**
  * Method that adds newly created formGroup to the formArray 
  */
  addMenu() {
    this.menuArr.push(this.initMenuRows());
  }
  /**
  * Method that open uploaded file in new tab
  * @param controlName 
  * @param i 
  */
  viewFile(formArrayName: string, controlName: string, i: number) {
    window.open(this.menuItemForm['controls'][formArrayName]['controls'][i]['controls'][controlName].value);
  }
  /**
   * Method that toggle upload data modal
   */
  toggleUploadDataModal() {
    this.showUploadDataModal = !this.showUploadDataModal;
  }
}
