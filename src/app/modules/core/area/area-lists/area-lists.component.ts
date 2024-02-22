import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ConfirmationDialogComponent } from 'src/app/shared/components/confirmation-dialog/confirmation-dialog.component';
import { pageSizeOptions, Roles } from 'src/app/shared/models/constants/constant.type';
import { CityAreaService } from 'src/app/shared/services/city-area.service';
import { SharedService } from 'src/app/shared/services/shared.service';
import { ToastService } from 'src/app/shared/services/toast.service';
import { Area, FilterArea } from '../model/area';
@Component({
  selector: 'app-area-lists',
  templateUrl: './area-lists.component.html',
  styleUrls: ['./area-lists.component.scss'],
})
export class AreaListsComponent implements OnInit {
  showFilterFields: boolean;
  areaList: MatTableDataSource<any>;
  displayedColumns: string[] = [
    'sr no',
    'cityName',
    'areaName',
    'status',
    'delete',
  ];
  @Output() polygonAdd = new EventEmitter<boolean>();
  @Output() polygonView = new EventEmitter<boolean>();
  @Output() polygonViewAll = new EventEmitter<string>();
  areaDataArr: Area[] = [];
  globalFilter: string;
  filterAreaFields: FilterArea = new FilterArea();
  isToggle = true;
  areaStatus: string;

  pageSizeOptions = pageSizeOptions;
  canAddDeletePolygon: boolean;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  constructor(
    private cityAreaService: CityAreaService,
    private dialog: MatDialog,
    private toastMsgService: ToastService,
    private sharedService: SharedService
  ) { }
  ngOnInit(): void {
    this.setAreaList();
    this.identifyPolygonAccess();
  }
  /**
   * Method that sets the area list
   */
  setAreaList() {
    this.cityAreaService.getAreaList().subscribe((response) => {
      if (response['status'] === true) {
        this.areaDataArr = [];
        for (const a of response['result']) {
          if (a.status === 'active') {
            a.status = 'Active';
          }
          if (a.status === 'inactive') {
            a.status = 'Inactive';
          }
          this.areaDataArr.push(Area.fromJson(a));
        }
        this.areaList = new MatTableDataSource(this.areaDataArr);
        this.areaList.paginator = this.paginator;
        this.areaList.sort = this.sort;
        this.areaList.filterPredicate = this.customFilterPredicate();
      }
    });
  }
  /**
   * Method that deletes area based on user selection
   * @param row
   */
  deleteArea(row: any) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        title: 'Are you sure ?',
        message: `You want to delete ${row.areaName}`,
        confirmBtnText: 'OK',
        dismissBtnText: 'Cancel',
      },
    });
    dialogRef.afterClosed().subscribe((response) => {
      if (response) {
        this.cityAreaService.deleteAreaPolygon(row.id).subscribe((res) => {
          this.setAreaList();
        });
      }
    });
  }
  /**
   * Method that shows add area polygon page
   */
  showAddPolygonPage() {
    this.polygonAdd.emit();
  }
  /**
   * Method that emits polygon details to view coords in map
   * @param polygon 
   */
  viewPolygonInMap(polygon) {
    this.polygonView.emit(polygon);
  }

  viewAllPolygonInMap(cityId: string) {
    this.polygonViewAll.emit(cityId);
  }
  /**
   * Method that matches string of search bar with table content
   * @param filter
   */
  globalSearch(filter: string) {
    this.globalFilter = filter;
    this.areaList.filter = JSON.stringify(this.filterAreaFields);
  }
  /**
   * Method that filters data based on search strings and filters
   * @returns boolean
   */
  customFilterPredicate() {
    const filterPredicate = (data: Area, filter: string): boolean => {
      if (this.globalFilter) {
        // search all text fields
        return (
          data.id
            .trim()
            .toLowerCase()
            .indexOf(this.globalFilter.toLowerCase()) !== -1 ||
          data.cityName
            .trim()
            .toLowerCase()
            .indexOf(this.globalFilter.toLowerCase()) !== -1 ||
          data.areaName
            .trim()
            .toLowerCase()
            .indexOf(this.globalFilter.toLowerCase()) !== -1 ||
          data.status
            .trim()
            .toLowerCase()
            .indexOf(this.globalFilter.toLowerCase()) !== -1
        );
      }
      let filteredData: FilterArea = JSON.parse(filter);
      for (const i in filteredData) {
        if (!filteredData[i]) filteredData[i] = '';
      }
      return (
        data.id.trim().toLowerCase().indexOf(filteredData.id.toLowerCase()) !==
        -1 &&
        data.cityName
          .trim()
          .toLowerCase()
          .indexOf(filteredData.city.toLowerCase()) !== -1 &&
        data.areaName
          .trim()
          .toLowerCase()
          .indexOf(filteredData.area.toLowerCase()) !== -1 &&
        data.status
          .trim()
          .toLowerCase()
          .indexOf(filteredData.status.toLowerCase()) !== -1
      );
    };
    return filterPredicate;
  }
  /**
   * Method that filters table data based on user choice from dropdowns
   */
  applyFilter() {
    this.areaList.filter = JSON.stringify(this.filterAreaFields);
    this.areaList.filterPredicate = this.customFilterPredicate();
  }
  /**
   * Method that clear all the filters from the table
   */
  clearFilter(fieldName?: 'all') {
    if (fieldName === 'all') {
      this.showFilterFields = false;
      this.filterAreaFields = new FilterArea();
    }
    this.areaList.filter = JSON.stringify(this.filterAreaFields);
  }
  /**
   * Method that changes the status of the area
   */
  changeStatus() {
    this.isToggle = !this.isToggle;
  }

  /**
   * Method that identifies whethere user has access to create or delete polygon
   */
  identifyPolygonAccess() {
    this.canAddDeletePolygon = [Roles.superadmin, Roles.serviceability].some(r => this.sharedService.roles.includes(r));
  }
}
