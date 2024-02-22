import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-partner-users',
  templateUrl: './partner-users.component.html',
  styleUrls: ['./partner-users.component.scss'],
})
export class PartnerUsersComponent implements OnInit {
  showPartnerUsersModal: boolean;
  partnerUsersForm = new FormGroup({
    vendorId: new FormControl({ disabled: true, value: '' }),
    password: new FormControl('', [Validators.required]),
    selectPOSSoftware: new FormControl(null, [Validators.required]),
  });
  posSoftwares = [
    { id: 1, name: 'Pet Pooja' },
    { id: 2, name: 'Slick POS' },
    { id: 3, name: 'Go Frugal' },
    { id: 4, name: 'Torqus' },
    { id: 5, name: 'POSist' },
  ];

  partnerUsersList: MatTableDataSource<any> = new MatTableDataSource();
  displayedColumns: string[] = [
    'srNo',
    'vendorId',
    'posSoftware',
    'fromDate',
    'toDate',
    'action',
  ];

  ELEMENT_DATA = [
    {
      vendorId: '3101',
      posSoftware: 'Pet Pooja',
      fromDate: new Date(new Date().getTime() + 24 * 60 * 60 * 1000),
      toDate: new Date(new Date().getTime() + 48 * 60 * 60 * 1000),
    },
    {
      vendorId: '3102',
      posSoftware: 'Slick POS',
      fromDate: new Date(new Date().getTime() + 24 * 60 * 60 * 1000),
      toDate: new Date(new Date().getTime() + 48 * 60 * 60 * 1000),
    },
    {
      vendorId: '3103',
      posSoftware: 'Go Frugal',
      fromDate: new Date(new Date().getTime() + 24 * 60 * 60 * 1000),
      toDate: new Date(new Date().getTime() + 48 * 60 * 60 * 1000),
    },
    {
      vendorId: '3103',
      posSoftware: 'Torqus',
      fromDate: new Date(new Date().getTime() + 24 * 60 * 60 * 1000),
      toDate: new Date(new Date().getTime() + 48 * 60 * 60 * 1000),
    },
    {
      vendorId: '3103',
      posSoftware: 'POSist',
      fromDate: new Date(new Date().getTime() + 24 * 60 * 60 * 1000),
      toDate: new Date(new Date().getTime() + 48 * 60 * 60 * 1000),
    },
  ];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  search = new FormControl();
  showFilterFields: boolean = true;

  constructor() { }

  ngOnInit(): void {

  }

  togglePartnerUsersModal() {
    this.showPartnerUsersModal = !this.showPartnerUsersModal;
  }

  searchPartnerUsers() {
    const filterValue = this.search.value;
    this.partnerUsersList.filter = filterValue.trim().toLowerCase();

    if (this.partnerUsersList.paginator) {
      this.partnerUsersList.paginator.firstPage();
    }
  }
  /**
   * Method that shows the filter fields
   */
  showFilters() {
    this.showFilterFields = !this.showFilterFields;
  }
}
