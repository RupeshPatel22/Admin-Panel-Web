import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { pageSizeOptions } from 'src/app/shared/models';
import { DataDumpService } from 'src/app/shared/services/data-dump.service';
import { ToastService } from 'src/app/shared/services/toast.service';
import { GlobalVarDialogComponent } from './global-var-dialog/global-var-dialog.component';
import { GlobalVar } from './model/global-var';

@Component({
  selector: 'app-global-var',
  templateUrl: './global-var.component.html',
  styleUrls: ['./global-var.component.scss']
})
export class GlobalVarComponent implements OnInit {

  globalVarList: MatTableDataSource<GlobalVar> = new MatTableDataSource();
  displayedColumns: string[] = ['sr no', 'key', 'description', 'updatedAt', 'updatedBy'];
  globalFilter: string;
  pageSizeOptions = pageSizeOptions;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  constructor(private dataDumpService: DataDumpService, private dialog: MatDialog, private toastMsgService: ToastService) { }

  ngOnInit(): void {
    this.getAllGlobalVar();
  }


  /**
  * Method that matches string of search bar with table content
  * @param filter
  */
   globalSearch(filter: string) {
    this.globalFilter = filter;
    this.globalVarList.filter = this.globalFilter.trim().toLowerCase();

    if (this.globalVarList.paginator) {
      this.globalVarList.paginator.firstPage();
    }
  }

  /**
   * Method that gets all details of global var
   */
  getAllGlobalVar() {
    this.dataDumpService.getAllGlobalVar().subscribe(res => {
      this.globalVarList.data = [];
      for (const i of res['result']) {
        this.globalVarList.data.push(GlobalVar.fromJson(i));
      }
      this.globalVarList.paginator = this.paginator;
      this.globalVarList.sort = this.sort;
    })
  }

  /**
   * Method that opens dialog and show details of global var
   * also update the details based on flag received on closing of the dialog
   * @param globalVar 
   */
  openGlobalVarDialog(globalVar: GlobalVar) {
    const dialogRef = this.dialog.open(GlobalVarDialogComponent, {
      data: {
        globalVar
      }
    })
    dialogRef.afterClosed().subscribe(response => {
      if (response.flag) {
        const data = {
          value: response.value,
          description: response.description,
        }
        this.dataDumpService.putGlobalVar(globalVar.key, data).subscribe(res => {
          this.getAllGlobalVar();
          this.toastMsgService.showSuccess(`${globalVar.key} is updated successfully`);
        })
      }
    })
  }

}
