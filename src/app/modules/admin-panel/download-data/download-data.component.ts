import { Component, OnInit } from '@angular/core';
import { DownloadDataService } from 'src/app/shared/services/download-data.service';
import { Services } from 'src/app/shared/models/constants/constant.type';
import { ToastService } from 'src/app/shared/services/toast.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { downloadFile } from 'src/app/shared/functions/modular.functions';


@Component({
  selector: 'app-download-data',
  templateUrl: './download-data.component.html',
  styleUrls: ['./download-data.component.scss'],
})
export class DownloadDataComponent implements OnInit {
  service: string;


  downloadArr = [
    {
      title: 'Item Bulk Download',
      inputHeading: 'Download regular menu for one or more outlets',
      apiUrl: 'admin/menu/csv/menu_item',
      outletIds: ''
    },
    {
      title: 'Add On Group Bulk Download',
      inputHeading: 'Download Add On Group for one or more outlets',
      apiUrl: 'admin/menu/csv/item_addon_group',
      outletIds: ''
    },
    {
      title: 'Add On Bulk Download',
      inputHeading: 'Download Add Ons for one or more outlets',
      apiUrl: 'admin/menu/csv/menu_item_addon',
      outletIds: ''
    },
    // {
    //   title: 'Selected Restaurants Download'
    // },
    // {
    //   title: 'Last n Restaurants Download'
    // },
    // {
    //   title: 'Selected Restaurants Schedule Download'
    // },
    // {
    //   title: 'Item Inventory Download'
    // },
  ];

  constructor(private downloadDataService: DownloadDataService,private toastMsgService: ToastService) { }
  ngOnInit(): void {
    this.service = this.downloadDataService.service;
  }

  /**
   * Method that converts the data to csv format
   * @param objArray 
   * @returns csv
   */
  convertToCSV(objArray: any) {
    var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
    var str = '';
    var row = '';
    for (var index in objArray[0]) {
      //Now convert each value to string and comma-separated
      if (index !== '0') {
        row += index + ',';
      }
    }
    //append Label row with line break
    str += row;

    for (var i = 0; i < array.length; i++) {
      var line = '';
      for (var index in array[i]) {
        if (line != '') line += ',';

        line += array[i][index];
      }
      str += line;
    }
    return str;
  }

  /**
   * Method to download csv file
   */
  downloadCSV(obj: any) {
    if (!obj.outletIds) return this.toastMsgService.showWarning(`Kindly Enter Outlet Ids`); 
    this.downloadDataService
      .download(obj.apiUrl, obj.outletIds)
      .subscribe(res => {
        downloadFile(res,  obj.title + '-' + obj.outletIds);
      });
  }
}

