import { LeaveType } from './../../leave-type/models/LeaveType';
import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {Leave} from '../models/Leave';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import { HttpCommonService } from 'src/app/core/services/httpCommon.service';

@Injectable()
export class LeaveDataService {
  statuses = ['NEW', 'APPROVED','REJECTED']
  leaveTypes=[{id:0,type:''}];
  employees=[{id:0,firstName:'',lastName:''}];
  dataChange: BehaviorSubject<Leave[]> = new BehaviorSubject<Leave[]>([]);
  // Temporarily stores data from dialogs
  dialogData: any;

  constructor (private httpClient: HttpCommonService) {
    this.httpClient.get('LeaveType/GetLeaveTypes').subscribe((data:any) => {
      this.leaveTypes = data;
    },
    (error: HttpErrorResponse) => {
    console.log (error.name + ' ' + error.message);
    });

    this.httpClient.get('Employee/GetEmployee').subscribe((data:any) => {
      this.employees = data;
    },
    (error: HttpErrorResponse) => {
    console.log (error.name + ' ' + error.message);
    });
  }

  get data(): Leave[] {
    return this.dataChange.value;
  }

  getDialogData() {
    return this.dialogData;
  }

  /** CRUD METHODS */
  getAllLeaves(): void {
    this.httpClient.get('Leave/GetLeave').subscribe((data:any) => {
        this.dataChange.next(data);
      },
      (error: HttpErrorResponse) => {
      console.log (error.name + ' ' + error.message);
      });
  }

  // DEMO ONLY, you can find working methods below
  addLeave (Leave: Leave): void {
    this.dialogData = Leave;
    let e = this.getEmployees().filter(x=>x.id===Leave.employeeId)[0]
    Leave.fullName = e.firstName+ " "+e.lastName;
    Leave.leaveType = this.getLeaveTypes().filter(x=>x.id===Leave.leaveTypeId)[0].type;
    this.httpClient.post('Leave/InsertLeave',Leave).subscribe((data:any) => {
      //this.dataChange.next(data);
    },
    (error: HttpErrorResponse) => {
    console.log (error.name + ' ' + error.message);
    });
  }

  updateLeave (Leave: Leave): void {
    this.dialogData = Leave;
    let e = this.getEmployees().filter(x=>x.id===Leave.employeeId)[0]
    Leave.fullName = e.firstName+ " "+e.lastName;
    Leave.leaveType = this.getLeaveTypes().filter(x=>x.id===Leave.leaveTypeId)[0].type;
    this.httpClient.put('Leave/UpdateLeave',Leave).subscribe((data:any) => {
      //this.dataChange.next(data);
    },
    (error: HttpErrorResponse) => {
    console.log (error.name + ' ' + error.message);
    });
  }

  deleteLeave (id: number): void {
    console.log(id);
    this.httpClient.delete('Leave/DeleteLeave/'+id).subscribe((data:any) => {
      //this.dataChange.next(data);
    },
    (error: HttpErrorResponse) => {
    console.log (error.name + ' ' + error.message);
    });
  }

  getStatues(){
    return this.statuses
  }
  getLeaveTypes(){
    return this.leaveTypes
  }
  getEmployees(){
    return this.employees
  }
}



