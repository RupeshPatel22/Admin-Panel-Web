import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ConfirmationDialogComponent } from 'src/app/shared/components/confirmation-dialog/confirmation-dialog.component';
import { DataDumpService } from 'src/app/shared/services/data-dump.service';
import { ToastService } from 'src/app/shared/services/toast.service';
import { AddPndCategoryDialogComponent } from './add-pnd-category-dialog/add-pnd-category-dialog.component';

@Component({
  selector: 'app-pnd-category',
  templateUrl: './pnd-category.component.html',
  styleUrls: ['./pnd-category.component.scss']
})
export class PndCategoryComponent implements OnInit {

  categoryList: MatTableDataSource<any> = new MatTableDataSource();
  displayedColumns: string[] = ['sr no', 'categoryDetails', 'status', 'actions'];
  showFilterFields: boolean;
  globalFilter: string;
  filterStatus: string;
  filteredValues = { status: '' };
  statuses = [
    { id: 'active', name: 'Active' },
    { id: 'inactive', name: 'In-Active' }
  ]
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  constructor(private dataDumpService: DataDumpService, private dialog: MatDialog, private toastService: ToastService) { }

  ngOnInit(): void {
    this.setCategoriesList();
  }

  /**
   * Method that sets category list by making api call
   */
   setCategoriesList(status?: string) {
    this.dataDumpService.getPndCategoriesList().subscribe(res => {
      this.categoryList.data = [];
      for (const c of res['result']) {
        if (!status || status === c.status) {
          this.categoryList.data.push(c);
        }
      }
      this.categoryList.paginator = this.paginator;
      this.categoryList.sort = this.sort;
      this.categoryList.filterPredicate = this.customFilterPredicate();
    });
  }
  

  /**
   * Method that opens dialog to add new category and then makes api call to add 
   */
  openAddCategoryDialog() {
    const dialogRef = this.dialog.open(AddPndCategoryDialogComponent, {
      autoFocus: false,
    });

    dialogRef.afterClosed().subscribe((response) => {
      if (response.flag) {
        const data = {
          name: response.categoryName,
          status: 'active',
        };
        this.dataDumpService.postPndCategory(data).subscribe((res) => {
          this.setCategoriesList();
          this.toastService.showSuccess('New Category added successfully')
        });
      }
    });
  }

  /**
   * Method that updates active/inactive status of the category
   * @param category 
   */
  changeStatus(category: any) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        title: 'Are you sure ?',
        message: `Do you want to update the status of the Category: ${category.name}?`,
        confirmBtnText: 'OK',
        dismissBtnText: 'Cancel'
      }
    });
    dialogRef.afterClosed().subscribe(response => {

      if (response) {
        category.status === 'active' ? category.status = 'inactive' : category.status = 'active';
        this.dataDumpService.putPndCategory(category.id, category).subscribe(res => {
          this.toastService.showSuccess('Category status updated successfully');
        });
      }
    })
  }

  /**
   * Method that deletes category based on user selection
   * @param category
   */
  deleteCategory(category: any) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        title: 'Are you sure ?',
        message: `You want to delete Category: ${category.name}`,
        confirmBtnText: 'OK',
        dismissBtnText: 'Cancel',
      },
    });
    dialogRef.afterClosed().subscribe((response) => {
      if (response) {
        this.dataDumpService.deletePndCategory(category.id).subscribe((res) => {
          this.toastService.showSuccess('Category deleted successfully');
          this.setCategoriesList();
        });
      }
    });
  }

  /**
 * Method that matches string of search bar with table content
 * @param filter
 */
  globalSearch(filter) {
    this.globalFilter = filter;
    this.categoryList.filter = JSON.stringify(this.filteredValues);
  }

  /**
   * Method that clears already set filter and hide filter fields
   */
  clearFilter() {
    this.filterStatus = null;
    this.filteredValues['status'] = '';
    this.showFilterFields = false;
    this.setCategoriesList();
  }

  /**
   * Method that checks for the globalFilter value to perform the search on all the category name
   * @returns true 
   * @returns filterPredicate
   * 
   */
  customFilterPredicate() {
    const filterPredicate = (data: any, filter: string): boolean => {
      if (this.globalFilter) {
        // search all category name
        return (
          data.name.trim().toLowerCase().indexOf(this.globalFilter.toLowerCase()) !== -1
        );
      }
    return true;
    };
    return filterPredicate;
  }

}
