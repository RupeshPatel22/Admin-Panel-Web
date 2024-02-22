import { Component, Input, OnInit } from '@angular/core';
import { ChangeLog } from '../model/change-log';

@Component({
  selector: 'app-change-log-details',
  templateUrl: './change-log-details.component.html',
  styleUrls: ['./change-log-details.component.scss']
})
export class ChangeLogDetailsComponent implements OnInit {

  @Input() logDetails: ChangeLog;
  constructor() { }

  ngOnInit(): void {
  }

}
