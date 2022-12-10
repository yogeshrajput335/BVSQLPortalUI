import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { LeaveType } from '../models/LeaveType';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { HttpCommonService } from 'src/app/core/services/httpCommon.service';

@Injectable()
export class LeaveTypeDataService {
  statuses = ['ACTIVE', 'INACTIVE']
  dataChange: BehaviorSubject<LeaveType[]> = new BehaviorSubject<LeaveType[]>([]);
  dialogData: any;

  constructor(private httpClient: HttpCommonService) { }

  get data(): LeaveType[] {
    return this.dataChange.value;
  }

  getDialogData() {
    return this.dialogData;
  }

  getAllLeaveTypes(): void {
    this.httpClient.get('LeaveType/GetLeaveTypes').subscribe((data: any) => {
      this.dataChange.next(data);
    },
      (error: HttpErrorResponse) => {
        console.log(error.name + ' ' + error.message);
      });
  }

  addLeaveType(leaveType: LeaveType): void {
    this.dialogData = leaveType;
    this.httpClient.post('LeaveType/InsertLeaveType', leaveType).subscribe((data: any) => {
    },
      (error: HttpErrorResponse) => {
        console.log(error.name + ' ' + error.message);
      });
  }

  updateLeaveType(leaveType: LeaveType): void {
    this.dialogData = leaveType;
    this.httpClient.put('LeaveType/UpdateLeaveType', leaveType).subscribe((data: any) => {
    },
      (error: HttpErrorResponse) => {
        console.log(error.name + ' ' + error.message);
      });
  }

  deleteLeaveType(id: number): void {
    this.httpClient.delete('LeaveType/DeleteLeaveType/' + id).subscribe((data: any) => {
    },
      (error: HttpErrorResponse) => {
        console.log(error.name + ' ' + error.message);
      });
  }

  getStatues() {
    return this.statuses
  }
}



