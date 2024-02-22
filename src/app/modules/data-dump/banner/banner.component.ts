import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ConfirmationDialogComponent } from 'src/app/shared/components/confirmation-dialog/confirmation-dialog.component';
import { pageSizeOptions } from 'src/app/shared/models';
import { CoreService } from 'src/app/shared/services/core.service';
import { ToastService } from 'src/app/shared/services/toast.service';
import { BannerDialogComponent } from './banner-dialog/banner-dialog.component';
import { Banner } from './model/banner';

@Component({
  selector: 'app-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.scss']
})
export class BannerComponent implements OnInit {

  bannersList: MatTableDataSource<Banner> = new MatTableDataSource();
  displayedColumns: string[] = ['sr no', 'id', 'title', 'bannerLink', 'image', 'status', 'action'];
  globalFilter: string;
  pageSizeOptions = pageSizeOptions;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  constructor(private coreService: CoreService, private dialog: MatDialog, private toastMsgService: ToastService) { }

  ngOnInit(): void {
    this.getBanners();
  }

  /**
   * Method that matches string of search bar with table content
   * @param filter
   */
   globalSearch(searchTerm: string) {
    this.globalFilter = searchTerm;
    this.bannersList.filter = searchTerm.trim().toLowerCase();

    if (this.bannersList.paginator) {
      this.bannersList.paginator.firstPage();
    } 
  }

  /**
   * Method that get all banners
   */
  getBanners() {
    this.coreService.getBanners().subscribe(res => {
      this.bannersList.data = [];
      for(const i of res['result']) {
        this.bannersList.data.push(Banner.fromJson(i));
      }
      this.bannersList.paginator = this.paginator;
      this.bannersList.sort = this.sort;
    })
  }

  /**
   * Method that adds banner
   */
  addBanner() {
    const dialogRef = this.dialog.open(BannerDialogComponent, {
      autoFocus: false,
    })
    dialogRef.afterClosed().subscribe(response => {
      if (response.flag) {
        this.coreService.postBanner(response.dataToSend).subscribe(res => {
          this.toastMsgService.showSuccess('Banner is added successfully');
          this.getBanners();
        })
      }
    })
  }

  /**
   * Method that edits banner details
   * @param banner 
   */
  editBanner(banner: Banner) {
    const dialogRef = this.dialog.open(BannerDialogComponent, {
      autoFocus: false,
      data: banner
    })
    dialogRef.afterClosed().subscribe(response => {
      if (response.flag) {
        this.coreService.putBanner(banner.id, response.dataToSend).subscribe(res => {
          this.toastMsgService.showSuccess('Banner is updated successfully');
          this.getBanners();
        })
      }
    })
  }

  /**
   * Method that deletes the banner
   * @param banner 
   */
  deleteBanner(banner: Banner) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        title: 'Are you sure ?',
        message: `You want to delete the banner: ${banner.id}`,
        confirmBtnText: 'OK',
        dismissBtnText: 'Cancel',
      },
    })
    dialogRef.afterClosed().subscribe(response => {
      if (response) {
        this.coreService.deleteBanner(banner.id).subscribe(res => {
          this.toastMsgService.showSuccess('Banner is deleted successfully');
          this.getBanners();
        })
      }
    })
  }

  /**
   * Method that changes the status of the banner
   * @param banner 
   */
  changeStatus(banner: Banner) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        title: 'Are you sure ?',
        message: `Do you want to update the status of the Banner: ${banner.id}?`,
        confirmBtnText: 'OK',
        dismissBtnText: 'Cancel'
      }
    });
    dialogRef.afterClosed().subscribe(response => {

      if (response) {
        const data = {
          title: banner.title,
          status: banner.status === 'active' ? 'created' : 'active',
          banner_link: banner.bannerLink,
        }
        this.coreService.putBanner(banner.id, data).subscribe(res => {
          this.toastMsgService.showSuccess('Status is updated successfully');
          banner.status = data['status'];
        });
      }
    })
  }
}
