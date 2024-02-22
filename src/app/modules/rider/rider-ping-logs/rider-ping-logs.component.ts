import { Component, OnInit, ViewChild } from '@angular/core';
import { RiderService } from 'src/app/shared/services/rider.service';
import { RiderActiveStatusList, RiderLogs, RiderLogsFilter, RiderShift } from './model/rider-ping-logs';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { FormControl, FormGroup } from '@angular/forms';
import { ToastService } from 'src/app/shared/services/toast.service';
import * as d3 from 'd3';
import { RiderTracking } from '../live-tracking/model/live-tracking';

@Component({
  selector: 'app-rider-ping-logs',
  templateUrl: './rider-ping-logs.component.html',
  styleUrls: ['./rider-ping-logs.component.scss']
})
export class RiderPingLogsComponent implements OnInit {

  riderLogList: MatTableDataSource<RiderLogs> = new MatTableDataSource();
  displayedColumns: string[] = ['riderActiveStatus','latitude','longitude','createdAt', 'action'];
  showFilterFields: boolean;
  filterRiderFields: RiderLogsFilter = new RiderLogsFilter();
  readonly riderActiveStatusList = RiderActiveStatusList;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  riderName: string;
  pageTitle: string = 'Rider Ping Logs';
  riderPingLogsMapList: RiderLogs[] = [];
  mapLatitude: number = 21.1458;
  mapLongitude:  number = 79.0882;
  
  maxDate = new Date()
  minDate = new Date()
  filterDateTimeForm = new FormGroup({
    startDate: new FormControl(),
    startTime: new FormControl(),
    endDate: new FormControl(),
    endTime: new FormControl()
  })
  showPingLogsMap: boolean;
  riderShiftDetails: RiderShift[] = [];
  showShiftDetail: boolean;
  showPingLogs: boolean;
  showNote: boolean = true;

  constructor(private riderService: RiderService, private activeRoute: ActivatedRoute, private router: Router, private toasterMsgService: ToastService) { 
    this.activeRoute.queryParams.subscribe(data => {
      this.filterRiderFields.riderShiftId = data.riderShiftId;
      this.filterRiderFields.riderId = data.riderId;
      this.riderName = data.riderName;
    })
  }

  ngOnInit(): void {
    if(this.riderName) this.pageTitle = `${this.riderName} Ping Logs`;
    this.getRiderPingLogs();
  }

  /**
   * Method that get rider logs detail using filter
   */
  getRiderLogsList() {

    this.showNote = false;
    this.filterRiderFields.startTime = null;
    this.filterRiderFields.endTime = null;
    if(this.filterDateTimeForm.dirty){
        const startDate = moment(this.filterDateTimeForm.get('startDate').value).format('YYYY-MM-DD');
        const startTime = moment(this.filterDateTimeForm.get('startTime').value,'h:mm A').format('HH:mm:ss');
        const endDate = moment(this.filterDateTimeForm.get('endDate').value).format('YYYY-MM-DD');
        const endTime = moment(this.filterDateTimeForm.get('endTime').value,'h:mm A').format('HH:mm:ss');
        const startDateTime = new Date(startDate + ' ' + startTime);
        const endDateTime = new Date(endDate + ' ' + endTime);
        if(!this.filterDateTimeForm.get('startTime').value){
          this.toasterMsgService.showError('Kindly enter start time');
        }
        if(!this.filterDateTimeForm.get('startDate').value){
          this.toasterMsgService.showError('Kindly enter start date');
        }
        if(!this.filterDateTimeForm.get('endTime').value){
          this.toasterMsgService.showError('Kindly enter end time');
        }
        if(!this.filterDateTimeForm.get('endDate').value){
          this.toasterMsgService.showError('Kindly enter end date');
        }
        if(this.filterDateTimeForm.get('endDate').value && this.filterDateTimeForm.get('endTime').value 
        && this.filterDateTimeForm.get('startDate').value && this.filterDateTimeForm.get('startTime').value){
          this.filterRiderFields.endTime = moment(endDateTime).unix();
          this.filterRiderFields.startTime = moment(startDateTime).unix();
          if(this.filterRiderFields.endTime && this.filterRiderFields.startTime)
          this.getRiderPingLogs();
        } 
        }else{
          this.getRiderPingLogs();
        }
    }
  /**
   * Method that call api to get rider ping logs detail
   */ 
  getRiderPingLogs(){
     // this is to update queryparams on change in filter values, so that on refreshing the page we can filter with latest data
     this.router.navigate([], {
      queryParams: {
        riderShiftId: this.filterRiderFields.riderShiftId || undefined,
        riderId: this.filterRiderFields.riderId || undefined,
        riderName: this.riderName || undefined
      }
    });
    const data = this.filterRiderFields.toJson();
    this.riderService.postRiderPingLogs(data).subscribe(res => {
      this.riderLogList.data = [];
      for (const i of res['result']['rider_logs']) {  
        this.riderLogList.data.push(RiderLogs.fromJson(i));
        this.riderPingLogsMapList.push(RiderLogs.fromJson(i));
      }
      this.riderShiftDetails.push(RiderShift.fromJson(res['result']['rider_shift']));
      this.riderLogList.sort = this.sort;
      this.generateChart();
    })
  }

  /**
   * Method that clear filter
   * @param fieldName 
   */
  clearFilter(fieldName: 'all' | 'date') {
    const riderShiftId = this.filterRiderFields.riderShiftId; // Store the current riderShiftId value
    if (fieldName === 'all') {
      this.showFilterFields = false;
      const riderId = this.filterRiderFields.riderId; // Store the current riderId value
      this.filterRiderFields = new RiderLogsFilter();
      this.filterRiderFields.riderShiftId = riderShiftId; // Restore the riderShiftId value
      this.filterRiderFields.riderId = riderId; // Restore the riderId value
      this.riderName = null;
      this.pageTitle = 'Rider Ping Logs';
      this.filterDateTimeForm.reset();
    } else if (fieldName === 'date') {
      this.filterRiderFields.startTime = this.filterRiderFields.endTime = null;
      this.filterDateTimeForm.reset();
    }
    this.getRiderLogsList();
  }

  /**
   * Method that open rider ping logs map
   * @param riderLat 
   * @param riderLng 
   */
  openMapfromRiderLatLong(riderLat:number, riderLng:number){
    const url = `https://www.google.com/maps/dir/?api=1&origin=${riderLat},${riderLng}&travelmode=driving`;
    window.open(url, '_blank');
  }

  /**
   * Method that hide and show shift detail modal
   */
  toggleShiftDetail() {
    this.showShiftDetail = !this.showShiftDetail;
  }

  generateChart() {
    // Clear previous chart
  d3.select('#chartContainer').html('');
    // Prepare data
    const parseDate = d3.timeParse('%d-%m-%Y, %I:%M %p');
    const statusMap = {
      busy: 3,
      idle: 2,
      allocating: 1,
      offline: 0,
    };
  
    const data = this.riderLogList.data.map((log) => ({
      date: parseDate(log.createdAt),
      status: statusMap[log.riderActiveStatus] || 0, // Map status to corresponding numeric value, defaulting to 0 if not found
    }));
  
    // Set up chart dimensions
    const width = 1000;
    const height = 500;
    const margin = { top: 30, right: 30, bottom: 80, left: 60 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;
  
    // Create SVG element
    const svg = d3
      .select('#chartContainer')
      .append('svg')
      .attr('width', width)
      .attr('height', height);
  
    // Create scales
    const xScale = d3
      .scaleTime()
      .domain(d3.extent(data, (d) => d.date))
      .range([margin.left, innerWidth + margin.left]);
  
    const yScale = d3
      .scaleLinear()
      .domain([0, 3]) // Set the domain for the numeric status values
      .range([innerHeight + margin.top, margin.top]);
  
    // Create line generator
    const line = d3
      .line<{ date: Date; status: number }>()
      .x((d) => xScale(d.date))
      .y((d) => yScale(d.status));
  
    // Append line path to SVG
    svg
      .append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', '#222239')
      .attr('stroke-width', 1.5)
      .attr('d', line);
  
    // Create x-axis
    svg
      .append('g')
      .attr('transform', `translate(0, ${innerHeight + margin.top})`)
      .call(
        d3
          .axisBottom(xScale)
          .tickFormat(d3.timeFormat('%d-%m-%Y, %I:%M %p')) // Format the tick labels
      )
      .selectAll('text')
      .attr('transform', 'rotate(-45)') // Rotate x-axis labels for better readability
      .style('text-anchor', 'end'); // Align x-axis labels to the end
  
    // Create y-axis
    svg
      .append('g')
      .attr('transform', `translate(${margin.left}, 0)`)
      .call(
        d3
          .axisLeft(yScale)
          .tickValues([0, 1, 2, 3]) // Set custom tick values
          .tickFormat((d) => {
            // Format the tick labels based on the numeric values
            switch (d) {
              case 0:
                return 'Offline';
              case 1:
                return 'Allocating';
              case 2:
                return 'Idle';
              case 3:
                return 'Busy';
              default:
                return '';
            }
          })
      );
    // Add horizontal lines
    svg
    .append('g')
    .attr('class', 'horizontal-lines')
    .selectAll('.horizontal-line')
    .data([1, 2, 3]) // Customize the tick values for horizontal lines
    .enter()
    .append('line')
    .attr('class', 'horizontal-line')
    .attr('x1', margin.left)
    .attr('y1', (d) => yScale(d))
    .attr('x2', innerWidth + margin.left)
    .attr('y2', (d) => yScale(d))
    .attr('stroke', '#ddd') // Customize the color of horizontal lines
    .attr('stroke-width', 1)
    // .attr('stroke-dasharray', '4 2'); // Add dashes to the horizontal lines

    // Add vertical lines
    svg
    .append('g')
    .attr('class', 'vertical-lines')
    .selectAll('.vertical-line')
    .data(data)
    .enter()
    .append('line')
    .attr('class', 'vertical-line')
    .attr('x1', (d) => xScale(d.date))
    .attr('y1', margin.top)
    .attr('x2', (d) => xScale(d.date))
    .attr('y2', innerHeight + margin.top)
    .attr('stroke', '#ddd') // Customize the color of vertical lines
    .attr('stroke-width', 1)
    // .attr('stroke-dasharray', '4 2'); // Add dashes to the vertical lines

    // Append dots on intercepts
    svg
    .selectAll('.dot')
    .data(data)
    .enter()
    .append('circle')
    .attr('class', 'dot')
    .attr('cx', (d) => xScale(d.date))
    .attr('cy', (d) => yScale(d.status))
    .attr('r', 4) // Customize the radius of the dots
    .attr('fill', '#222239'); // Customize the color of the dots
  }
  /**
   * Method that change color of map marker based on rider status
   * @param status 
   * @returns response
   */
  getMarkerIcon(riderActiveStatus: string): string {
    console.log(riderActiveStatus)
    switch (riderActiveStatus) {
        case 'idle':
            return 'https://maps.google.com/mapfiles/ms/icons/green-dot.png';
        case 'busy':
            return 'https://maps.google.com/mapfiles/ms/icons/red-dot.png';
        case 'allocating':
            return 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png';
        default:
            return 'https://maps.google.com/mapfiles/ms/icons/pink-dot.png';
    }
}

}