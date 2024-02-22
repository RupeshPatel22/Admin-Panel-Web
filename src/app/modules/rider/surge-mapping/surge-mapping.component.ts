import { DataDumpService } from 'src/app/shared/services/data-dump.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FilterMasterSurge, MasterSurge, masterSurgeTypeList } from '../../data-dump/master-surge/model/master-surge';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastService } from 'src/app/shared/services/toast.service';
import { FilterSurgeMapping, SurgeMapping, SurgeMappingData } from './model/surge-mapping';
import { MatTableDataSource } from '@angular/material/table';
import { pageSize, pageSizeOptions } from 'src/app/shared/models';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from 'src/app/shared/components/confirmation-dialog/confirmation-dialog.component';
import { FilterOperationalZone, OperationalZone } from '../operational-zone/model/operational-zone';
import { RiderService } from 'src/app/shared/services/rider.service';
import { Client } from '../client/model/client';

@Component({
  selector: 'app-surge-mapping',
  templateUrl: './surge-mapping.component.html',
  styleUrls: ['./surge-mapping.component.scss']
})
export class SurgeMappingComponent implements OnInit {

  surgeMappingData: MatTableDataSource<SurgeMappingData> = new MatTableDataSource();
  displayedColumns: string[] = ['surgeMappingId', 'surgeMappingStartAt', 'surgeMappingEndAt', 'surgeDetail', 'clientDetail', 'operationalZoneDetail', 'action'];
  showCreateSurgeMappingModal: boolean;
  createSurgeMappingForm = new FormGroup({
    surgeId: new FormControl(['', Validators.required]),
    operationalZoneId: new FormControl(['', Validators.required]),
    clientId: new FormControl(['', Validators.required]),
    startAt: new FormControl('', [Validators.required]),
    endAt: new FormControl('', [Validators.required]),
  });
  filterSurgeMappingData: FilterSurgeMapping = new FilterSurgeMapping();
  filterSurgeData: FilterMasterSurge = new FilterMasterSurge();
  filterOpsZoneData: FilterOperationalZone = new FilterOperationalZone();
  pageIndex: number = 0;
  pageSize: number = pageSize;
  pageSizeOptions = pageSizeOptions;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  totalSurgeRecords: number;
  showFilterFields: boolean;
  SurgeMappingDataList: SurgeMappingData[] = [];
  surgeList: MasterSurge[];
  readonly masterSurgeTypeList = masterSurgeTypeList;
  opZoneList: OperationalZone[];
  clientsList: Client[];

  constructor(private dialog: MatDialog, private dataDumpService: DataDumpService, private toastMsgService: ToastService, private riderService: RiderService) { }

  ngOnInit(): void {
    this.getAllSurgeMappingDetails();
    this.getSurgeDetails();
    this.getOperationalZone();
    this.getClientsDetails();
  }

  /**
   * Method that gets all the surge mapping details
   */
  getAllSurgeMappingDetails(filterFlag?: boolean) {
    if (filterFlag) {
      this.pageIndex = 0;
      this.paginator.pageIndex = 0;
    }
    this.filterSurgeMappingData.pageIndex = this.pageIndex;
    this.filterSurgeMappingData.pageSize = this.pageSize;
    const data = this.filterSurgeMappingData.toJson();
    this.dataDumpService.postSurgeMapping(data).subscribe((res) => {
      this.totalSurgeRecords = res['result']['total_records'];

      this.surgeMappingData.data = []
      for (const i of res['result']['records']) {
        this.surgeMappingData.data.push(SurgeMappingData.fromJson(i));
      }
      this.surgeMappingData.sort = this.sort;
    });
  }

  /**
 * Method that creates surge mapping with ops zone and client id
 * @returns res
 */
  createSurgeMapping() {
    this.showCreateSurgeMappingModal = true;
    if (this.createSurgeMappingForm.status === 'INVALID') return this.createSurgeMappingForm.markAllAsTouched();
    const formValues = this.createSurgeMappingForm.getRawValue();
    const data: SurgeMapping = new SurgeMapping();
    Object.assign(data, formValues);
    this.dataDumpService.createSurgeMapping(data.toJson()).subscribe(res => {
      this.toastMsgService.showSuccess('Surge Mapping Created Successfully !!!');
      this.showCreateSurgeMappingModal = !this.showCreateSurgeMappingModal;
      this.getAllSurgeMappingDetails();
    });
  }

  /**
   * Method that toogle create surge mapping modal
   * @param surge 
   */
  toggleCreateSurgeMappingModal() {
    this.showCreateSurgeMappingModal = !this.showCreateSurgeMappingModal;
  }

  /**
   * Method that clear filters
   * @param fieldName 
   */
  clearFilter(fieldName?: 'all') {
    if (fieldName === 'all') {
      this.showFilterFields = false;
      this.filterSurgeMappingData = new FilterSurgeMapping();
    }
    this.getAllSurgeMappingDetails();
  }

  /**
   * Method that deletes surge mapping based on surge mapping id
   * @param surgeMapping 
   */
  deleteSurgeMapping(surgeMapping: any) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        title: 'Are you sure ?',
        message: `Do you want to delete this Surge Mapping : ${surgeMapping.surgeMappingId}?`,
        confirmBtnText: 'OK',
        dismissBtnText: 'Cancel'
      }
    });
    dialogRef.afterClosed().subscribe(response => {
      if (response) {
        this.dataDumpService.deleteSurgeMapping(surgeMapping.surgeMappingId).subscribe(res => {
          this.getAllSurgeMappingDetails();
          this.toastMsgService.showSuccess(`Surge Mapping Id: ${surgeMapping.surgeMappingId} is deleted !!!`);
        });
      }
    })
  }

  /**
 * Method that navigates to master surge page based on surge id clicked
 * @param orderId 
 */
  navigateToMasterSurgePage(surgeId: string) {
    window.open(`/rider/data-dump/master-surge?surgeId=${surgeId}`, '_blank');
  }

  /**
* Method that navigates to operational zone page based on operational zone id clicked
* @param orderId 
*/
  navigateToOperationalZonePage(operationZoneId: string) {
    window.open(`/rider/operational-zone?operationalZoneId=${operationZoneId}`, '_blank');
  }

  /**
* Method that navigates to clients page based on client id clicked
* @param orderId 
*/
  navigateToClientsPage(clientId: string) {
    window.open(`/rider/client?clientId=${clientId}`, '_blank');
  }

  /**
   * Method that sets surge ids in a list
   * @param filterFlag 
   */
  getSurgeDetails(filterFlag?: boolean) {
    if (filterFlag) {
      this.pageIndex = 0;
      this.paginator.pageIndex = 0;
    }
    this.filterSurgeData.pageIndex = this.pageIndex;
    this.filterSurgeData.pageSize = this.pageSize;
    const data = this.filterSurgeData.toJson();
    this.surgeList = [];
    this.dataDumpService.postMasterSurge(data).subscribe(res => {
      for (const i of res['result']['records']) {
        this.surgeList.push(MasterSurge.fromJson(i));
      }
    })
  }

   /**
   * Method that filters operational zone
   * @param filterFlag 
   */
   getOperationalZone(filterFlag?: boolean) {
    if (filterFlag) {
      this.pageIndex = 0;
      this.paginator.pageIndex = 0;
    }
    this.filterOpsZoneData.pageIndex = this.pageIndex;
    this.filterOpsZoneData.pageSize = this.pageSize;
    const data = this.filterOpsZoneData.toJson();
    this.opZoneList = [];
    this.riderService.filterOperationalZone(data).subscribe(res => {
      for (const i of res['result']['records']) {
        this.opZoneList.push(OperationalZone.fromJson(i));
      }
    })
  }

    /**
   * Method that gets all client details
   */
    getClientsDetails() {
      this.riderService.getClientsDetails().subscribe(res => {
        this.clientsList= [];
        for (const i of res['result']) {
          this.clientsList.push(Client.fromJson(i));
        }
      })
    }
}


