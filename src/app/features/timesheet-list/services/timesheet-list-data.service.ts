import { Employee } from './../../employee/models/Employee';
import { Project } from './../../project/models/Project';
import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import { HttpCommonService } from 'src/app/core/services/httpCommon.service';
import { TimesheetList } from '../models/TimesheetList';


@Injectable()
export class TimesheetListDataService {
  statuses = ['NEW', 'APPROVED','REJECTED']
  projects=[{id:0,projectName:''}];
  employees=[{id:0,firstName:'',lastName:''}];
  dataChange: BehaviorSubject<TimesheetList[]> = new BehaviorSubject<TimesheetList[]>([]);
  dialogData: any;

  constructor (private httpClient: HttpCommonService) {
    this.httpClient.get('Employee/GetEmployee').subscribe((data:any) => {
      this.employees = data;
    },
    (error: HttpErrorResponse) => {
    console.log (error.name + ' ' + error.message);
    });

    this.httpClient.get('Project/GetProjects').subscribe((data:any) => {
      this.projects = data;
    },
    (error: HttpErrorResponse) => {
    console.log (error.name + ' ' + error.message);
    });

  }

  get data(): TimesheetList[] {
    return this.dataChange.value;
  }

  getDialogData() {
    return this.dialogData;
  }

  getAllTimesheetLists(): void {
    this.httpClient.get('Timesheet/GetTimesheet').subscribe((data:any) => {
        this.dataChange.next(data);
      },
      (error: HttpErrorResponse) => {
      console.log (error.name + ' ' + error.message);
      });
  }

  addTimesheetList (TimesheetList: TimesheetList,dates:any[],data:any[]): void {
    this.dialogData = TimesheetList;
    let p = this.getProjects().filter(x => x.id === TimesheetList.projectId)[0]
    TimesheetList.projectName = p.projectName;
    let e = this.getEmployees().filter(x => x.id === TimesheetList.employeeId)[0]
    TimesheetList.employeeName = e.firstName + " " + e.lastName;
    this.httpClient.post('Timesheet/InsertTimesheet',{timesheet:TimesheetList,date:dates,data:data}).subscribe((data:any) => {
    },
    (error: HttpErrorResponse) => {
    console.log (error.name + ' ' + error.message);
    });
  }

  updateTimesheetList(TimesheetList: TimesheetList): void {
    this.dialogData = TimesheetList;
    let p = this.getProjects().filter(x => x.id === TimesheetList.projectId)[0]
    TimesheetList.projectName = p.projectName;
    let e = this.getEmployees().filter(x => x.id === TimesheetList.employeeId)[0]
    TimesheetList.employeeName = e.firstName + " " + e.lastName;
    this.httpClient.put('Timesheet/UpdateTimesheet',TimesheetList).subscribe((data:any) => {
    },
    (error: HttpErrorResponse) => {
    console.log (error.name + ' ' + error.message);
    });
  }

  deleteTimesheetList(id: number): void {
    this.httpClient.delete('Timesheet/DeleteTimesheet/'+id).subscribe((data:any) => {
    },
    (error: HttpErrorResponse) => {
    console.log (error.name + ' ' + error.message);
    });
  }

  getStatues(){
    return this.statuses
  }

  getEmployees(){
    return this.employees
  }

  getProjects(){
    return this.projects
  }
}



