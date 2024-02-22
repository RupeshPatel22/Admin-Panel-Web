import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { downloadFile } from 'src/app/shared/functions/modular.functions';
import { dateShortTimeFormat, pageSize, pageSizeOptions, Roles, Services } from 'src/app/shared/models/constants/constant.type';
import { CityAreaService } from 'src/app/shared/services/city-area.service';
import { DownloadDataService } from 'src/app/shared/services/download-data.service';
import { OutletsService } from 'src/app/shared/services/outlets.service';
import { SharedService } from 'src/app/shared/services/shared.service';
import { ToastService } from 'src/app/shared/services/toast.service';
import { OutletDialogComponent } from './outlet-dialog/outlet-dialog.component';
import { FilterOutlet, Outlet } from './model/outlet';
import { DataDumpService } from 'src/app/shared/services/data-dump.service';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-outlets',
  templateUrl: './outlets.component.html',
  styleUrls: ['./outlets.component.scss']
})
export class OutletsComponent implements OnInit {

  outletsList: MatTableDataSource<Outlet> = new MatTableDataSource();
  displayedColumns: string[] = [
    // 'checkbox',
    'image',
    'name',
    'branchName',
    'posName',
    // 'pocNumber',
    'speedyyAccountManagerName',
    'outletType',
    'area',
    'city',
    'currentlyOpen',
    'status',
    'action',
  ];
  statusList: any[] = [
    { id: 'active', name: 'Active' },
    { id: 'disable', name: 'Disable' }
  ];
  typeList: any[] = [
    { id: 'restaurant', name: 'Restaurant' },
    { id: 'tea_and_coffee', name: 'Tea & Coffee' },
    { id: 'bakery', name: 'Bakery'}
  ];
  cityList: any[] = [];
  areaList: any[] = [];
  adminNames: any[] = [];
  totalOutletRecords: number;
  pageIndex: number = 0;
  pageSize: number = pageSize;
  pageSizeOptions = pageSizeOptions;
  showFilterFields: boolean;
  showTable: boolean = true;
  filterOutletFields: FilterOutlet = new FilterOutlet();
  service: string;
  readonly Services = Services;
  readonly dateShortTimeFormat = dateShortTimeFormat;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  selection = new SelectionModel<any>(true, []);

  constructor(private dialog: MatDialog, private outletsService: OutletsService, private downloadDataService: DownloadDataService,
    private toastMsgService: ToastService, private cityAreaService: CityAreaService, private sharedService: SharedService,
    private userService: UserService) { }


  ngOnInit(): void {
    this.setCityList();
    this.getOutletsList();
    this.setAdminNameList();
    this.service = this.outletsService.service;
        if(this.service === Services.Grocery || this.service === Services.Paan  || this.service === Services.Flower || this.service === Services.Pharmacy || this.service === Services.Pet) {
      this.displayedColumns = this.displayedColumns.filter(c => c !== 'outletType' && c !== 'posName');
    }
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
   * Method that sets admin name list
   */
    setAdminNameList() {
      const data={ 
        "pagination": {
          "page_index": 0,
          "page_size": 50
        }
      };
      this.userService.filterAdminUsers(data).subscribe(res => {
        for(const a of res['result'].records){
          this.adminNames.push(a);
        }
      })
    }

  getOutletsList(filterFlag?: boolean) {
    if (filterFlag) {
        this.pageIndex = 0;
        this.paginator.pageIndex = 0;
      }
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

  clearFilter(fieldName?: 'all' | 'city') {
    if (fieldName === 'all') {
      this.showFilterFields = false;
      this.filterOutletFields = new FilterOutlet();
    } else if (fieldName === 'city') {
      this.areaList = this.filterOutletFields.areaIds = [];
    }
    this.getOutletsList();
  }
  

  /**
   * Method that enable or disable the outlet
   * @param outlet 
   */
  changeStatus(outlet: any) {
    if (![Roles.superadmin, Roles.admin, Roles.ops_manager].some(r => this.sharedService.roles.includes(r)))
      return this.toastMsgService.showError("You don't have enough access to change the status");
    const dialogRef = this.dialog.open(OutletDialogComponent, {
      data: {
        title: outlet.status === 'active' ? 'Select reason for disabling the outlet' : 'Enter reason for enabling the outlet',
        action: outlet.status === 'active' ? 'disable' : 'active'
      },
      autoFocus: false,
    });

    dialogRef.afterClosed().subscribe(response => {
      if (response.flag) {
        const data = {
          disable: outlet.status === 'active' ? true : false,
          comments: response.comments
        }
        this.outletsService.updateOutletStatus(outlet.id, data).subscribe(res => {
          outlet.status === 'active' ? outlet.status = 'disable' : outlet.status = 'active';
          this.toastMsgService.showSuccess(`Outlet status updated successfully`);
        })
      }
    })
  }

  /**
   * Checks if all rows are selected or not
   * @returns boolean
   */
  isAllSelected() {
    return this.selection.selected.length === this.outletsList.data.length;
  }

  /**
   * Selects all rows if they are not all selected; otherwise clear selection.
   * @returns
   */
  toggleSelectAll() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }
    this.selection.select(...this.outletsList.data);
  }

  /**
   * Method that navigates to another tab based on outlet Id
   * @param rowId
   */
   navigateToOutletDetailsInNewWindow(outletId: string, outletName: string) {
    this.sharedService.navigateToOutletDetailsInNewWindow(outletId, outletName);
  }

  /**
   * Method that opens the modal
   * @param flag
   */
  triggerModal(flag: boolean) {
    if (!flag) {
      this.dialog.open(OutletDialogComponent, {
        data: {
          title: 'Select reason for disabling the restaurant',
        },
        autoFocus: false,
      });
    }
  }

  /**
 * Method to download csv file
 */
  downloadCSV(apiUrl: string, outletId: string) {
    this.downloadDataService
      .download(apiUrl, outletId)
      .subscribe(res => {
        downloadFile(res, outletId);
      });
  }
    /**
   * Method that copy pos contact number to clipboard
   * @param mobile
   */
    copyMobileToClipboard(mobile: string) {
      navigator.clipboard.writeText(mobile);
      this.toastMsgService.showSuccess('Rider contact number copied');
    }

    /**
 * Method that Export outlets data to a CSV file.
 * This method filters outlet fields, generates a CSV file, and initiates the download.
 */
    exportOutletsInCsv() {
      const data = this.filterOutletFields.toJson();
      data['filter']['in_csv'] = true;
      this.outletsService.downloadOutletCsvFile(data).subscribe(res => {
        downloadFile(res, this.outletsService.service );
      });
    }

}
