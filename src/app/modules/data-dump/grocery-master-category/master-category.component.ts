import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { DataDumpService } from 'src/app/shared/services/data-dump.service';
import { AddMasterCategoryDialogComponent } from './add-master-category-dialog/add-master-category-dialog.component';
import { ConfirmationDialogComponent } from 'src/app/shared/components/confirmation-dialog/confirmation-dialog.component';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MasterCategory } from './modal/master-category';
import { SharedService } from 'src/app/shared/services/shared.service';
import { ToastService } from 'src/app/shared/services/toast.service';
import { permissionDeniedErrorMsg } from 'src/app/shared/models';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-master-category',
  templateUrl: './master-category.component.html',
  styleUrls: ['./master-category.component.scss']
})
export class MasterCategoryComponent implements OnInit {
  masterCategoryList: MatTableDataSource<MasterCategory>;
  displayedColumns: string[] = ['sr no','masterCategoryImage','masterCategoryDetail','createdAt','updatedAt','actions'];
  masterCategoryDataArr: MasterCategory[] = [];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  isMasterCategorySequenceModalVisible: boolean;
  masterCategoryDetails: MasterCategory;

  constructor(private dataDumpService: DataDumpService, private dialog: MatDialog, private sharedService: SharedService, private toastMsgService: ToastService) { }

  ngOnInit(): void {
    this.setMasterCategory();
  }

  /**
   * Method that retrieves master category data using API call   
   */
  setMasterCategory() {
    this.dataDumpService.getMasterCategory().subscribe((res) => {
      this.masterCategoryDataArr = [];
      for (const i of res['result']) {
        this.masterCategoryDataArr.push(MasterCategory.fromJson(i));
      }
      this.masterCategoryList = new MatTableDataSource(this.masterCategoryDataArr);
      this.masterCategoryList.paginator = this.paginator;
      this.masterCategoryList.sort = this.sort;
    })
  }

  /**
   * Method that opens a dialog box to add or edit a master category.
   * @param masterCategory 
   */
  openMasterCategoryDialog(masterCategory?: MasterCategory) {
    const diallogRef = this.dialog.open(AddMasterCategoryDialogComponent, {
      data: masterCategory
    });

    diallogRef.afterClosed().subscribe((response) => {
      if(response.flag){
        if(!masterCategory){
          this.dataDumpService.addNewMasterCategory(response.dataToSend).subscribe(res => {
            this.setMasterCategory();
          })
        }else{
          this.dataDumpService.updateMasterCatergory(response.dataToSend, masterCategory.id).subscribe(res => {
            this.setMasterCategory();
          });
        }
      }
    })
  }

  /**
   * Method that opens a confirmation dialog box to delete a master category.
   * @param masterCategory 
   */
  deleteMasterCategory(masterCategory: MasterCategory){
    const diallogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        title: 'Are you sure ?',
        message: `You want to delete ${masterCategory.name}`,
        confirmBtnText: 'OK',
        dismissBtnText: 'Cancel',
      }
    });
    diallogRef.afterClosed().subscribe(res => {
      if(res) {
        this.dataDumpService.deleteMasterCatergory(masterCategory.id).subscribe(res => {
          this.setMasterCategory();
        });
      }
    })
  }
  
  /**
 * Opens the modal for changing the sequence of master categories in the menu.
 */
  openMasterCategorySequenceModal() {
    if (!this.sharedService.hasEditAccessForOutletDetails) return this.toastMsgService.showInfo(permissionDeniedErrorMsg);
    this.isMasterCategorySequenceModalVisible = true;
  }

  /**
* Closes the master category sequence modal.
*/
  closeSequenceModal() {
    this.isMasterCategorySequenceModalVisible = false;
    this.setMasterCategory();
  }

  /**
 * Updates the sequence of master categories in a menu list after a masteer category is dropped.
 * @param event The drag and drop event containing the previous and current indices of the master category.
 */
  dropMasterCategorySequence(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.masterCategoryDataArr, event.previousIndex, event.currentIndex);
  }

  /**
* Saves the sequence of the master categories by updating the sequence value and sending a PUT request.
* Shows a success message using toast message service upon successful response.
*/
  saveMasterCategorySequence() {
    this.masterCategoryDataArr.forEach((item, i) => {
      item.sequence = i + 1;
    });
    const sequenceData = {
      sorted_ids: this.masterCategoryDataArr.map(master => (
        master.id
      ))
    };
    this.dataDumpService.putMasterCategorySequence(sequenceData).subscribe(response => {
      this.toastMsgService.showSuccess('Master Category sequence updated successfully');
      this.closeSequenceModal();
    });
  }
}
