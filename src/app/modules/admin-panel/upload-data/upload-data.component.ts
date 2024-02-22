import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { downloadFile } from 'src/app/shared/functions/modular.functions';
import { Services } from 'src/app/shared/models/constants/constant.type';
import { ToastService } from 'src/app/shared/services/toast.service';
import { UploadDataService } from 'src/app/shared/services/upload-data.service';

@Component({
  selector: 'app-upload-data',
  templateUrl: './upload-data.component.html',
  styleUrls: ['./upload-data.component.scss'],
})
export class UploadDataComponent implements OnInit {

  uploadArr = [
    {
      title: 'Item Bulk Upload',
      apiUrl: 'admin/menu/csv/menu_item',
      sampleFileDownloadApiUrl: 'admin/menu/csv/menu_item/sample',
      fileName: 'No file chosen'
    },
    {
      title: 'Add On Group Bulk Upload',
      apiUrl: 'admin/menu/csv/item_addon_group',
      sampleFileDownloadApiUrl: 'admin/menu/csv/item_addon_group/sample',
      fileName: 'No file chosen'
    },
    {
      title: 'Add On Bulk Upload',
      apiUrl: 'admin/menu/csv/menu_item_addon',
      sampleFileDownloadApiUrl: 'admin/menu/csv/menu_item_addon/sample',
      fileName: 'No file chosen'
    },
    // {
    //   title: 'Restaurants Upload',
    //   fileName: 'No file chosen'
    // },
    // {
    //   title: 'Cloud Menu QC Bulk Upload',
    //   fileName: 'No file chosen'
    // },
    // {
    //   title: 'Item Inventory Upload',
    //   fileName: 'No file chosen'
    // },
    // {
    //   title: 'Item Holiday Slots Upload',
    //   fileName: 'No file chosen'
    // },
    // {
    //   title: 'Restaurant Holiday Slots Upload',
    //   fileName: 'No file chosen'
    // },
    // {
    //   title: 'Restaurant Schedule Upload',
    //   fileName: 'No file chosen'
    // },
    // {
    //   title: 'Mail GST-VCs To Restaurants',
    //   fileName: 'No file chosen'
    // },
    // {
    //   title: 'Item Schedules Upload',
    //   fileName: 'No file chosen'
    // },
    // {
    //   title: 'Restaurants is Exclusive Upload',
    //   fileName: 'No file chosen'
    // },
    // {
    //   title: 'Delete GST Detail',
    //   fileName: 'No file chosen'
    // },
  ];
  showStatusModal: boolean;
  displayedColumns: string[] = ['sr no', 'rowNumber', 'columnName', 'error'];
  changesTableDisplayedColumns: string[] = ['sr no', 'name', 'created', 'modified'];
  errorList: MatTableDataSource<any> = new MatTableDataSource();
  changesList: MatTableDataSource<any> = new MatTableDataSource();
  service: string;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  isPartialUpload: boolean

  constructor(private uploadDataService: UploadDataService, private toastMsgService: ToastService) { }

  ngOnInit(): void {
    this.service = this.uploadDataService.service;
  }


  /**
   * Method that opens status modal
   */
  openStatusModal() {
    this.showStatusModal = true;
  }

  /**
   * Method that closes status modal and
   * remove data from errorList array
   */
  closeStatusModal() {
    this.errorList.data = [];
    this.changesList.data = [];
    this.showStatusModal = false;
  }

  /**
   * Method that checks whether file is csv and assigned 
   * it to 'file' property of 'uploadArr'
   * @param files 
   * @param index 
   * @returns 
   */
  onFileSelect(files: FileList, index: number) {
    if (files.item(0).type !== 'text/csv') {
      this.toastMsgService.showWarning('You can only upload .csv files!!!');
      this.uploadArr[index]['fileName'] = 'No file chosen';
      this.uploadArr[index]['file'] = null
      return;
    }
    this.uploadArr[index]['fileName'] = files.item(0).name;
    this.uploadArr[index]['file'] = files.item(0);
  }

  /**
   * Method that uploads csv file
   * @param index 
   */
  fileUpload(index: number) {
    const file = this.uploadArr[index]['file'];

    // get fileUpload url by api call
    this.uploadDataService.getFileUploadUrl('csv').subscribe(
      res => {
        const fileName = res['result']['file_name'];

        // uploads file to aws-s3 bucket
        this.uploadDataService.uploadFile(res['result']['uploadUrl'], file).subscribe(
          res => {

            // sends uploaded file name
            this.uploadDataService.sendUploadedFileName(fileName, this.isPartialUpload,this.uploadArr[index]['apiUrl']).subscribe(
              (res) => {
                this.uploadArr[index]['fileName'] = 'No file chosen';
                this.uploadArr[index]['file'] = null;
                for (const i in res['result']) {
                  const data = {};
                  data['name'] = i.replace("_", " ");
                  data['created'] = res['result'][i]['Created'];
                  data['modified'] = res['result'][i]['Modified'];
                  this.changesList.data.push(data);
                }
                this.openStatusModal();
                setTimeout(() => {
                  this.changesList.paginator = this.paginator;
                  this.changesList.sort = this.sort;
                })
                this.toastMsgService.showSuccess('File is uploaded successfully');
              },
              (err) => {
                this.uploadArr[index]['fileName'] = 'No file chosen';
                this.uploadArr[index]['file'] = null;
                for (const i in err['error']['errors'][0]['data']) {
                  for (const j of err['error']['errors'][0]['data'][i]) {
                    const data = {};
                    data['rowNumber'] = i.replace("(", "- ").slice(0, -1);
                    data['columnName'] = j['column_name'];
                    data['error'] = j['error'];
                    this.errorList.data.push(data);
                  }
                }
                this.openStatusModal();
                setTimeout(() => {
                  this.errorList.paginator = this.paginator;
                  this.errorList.sort = this.sort;
                })
              }
            )
          }
        )
      }
    );
  }

  canUpload(index: number) {
    return this.uploadArr[index]['file'];
  }

  /**
   * Method to download csv file
   */
  downloadFormat(obj: any) {
    this.uploadDataService
      .getSampleFileFormat(obj.sampleFileDownloadApiUrl)
      .subscribe(res => {
        downloadFile(res, `${obj.title} sample`);
      });
  }

  /**
   * Method that sets partial upload variable to true or false based on toggle btn
   * @param isPartial 
   */
  partialUpload(isPartial: boolean){
    this.isPartialUpload = isPartial;
  }
}
