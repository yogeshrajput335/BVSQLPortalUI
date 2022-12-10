import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Employee } from '../models/Employee';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { HttpCommonService } from 'src/app/core/services/httpCommon.service';

@Injectable()
export class EmployeeDataService {
  statuses = ['ACTIVE', 'INACTIVE']
  employeeTypes = ['PERMANENT', 'CONTRACTOR']
  clients: any;
  projects: any;

  dataChange: BehaviorSubject<Employee[]> = new BehaviorSubject<Employee[]>([]);
  dialogData: any;

  constructor(private httpClient: HttpCommonService) {
    this.httpClient.get('Client/GetClient').subscribe((data: any) => {
      this.clients = data;
    },
      (error: HttpErrorResponse) => {
        console.log(error.name + ' ' + error.message);
      });
    this.httpClient.get('Project/GetProjects').subscribe((data: any) => {
      this.projects = data;
    },
      (error: HttpErrorResponse) => {
        console.log(error.name + ' ' + error.message);
      });

  }

  get data(): Employee[] {
    return this.dataChange.value;
  }

  getDialogData() {
    return this.dialogData;
  }

  /** CRUD METHODS */
  getAllEmployee(): void {
    this.httpClient.get('Employee/GetEmployee').subscribe((data: any) => {
      this.dataChange.next(data);
    },
      (error: HttpErrorResponse) => {
        console.log(error.name + ' ' + error.message);
      });
  }

  addEmployee(user: Employee): void {
    this.dialogData = user;
    this.httpClient.post('Employee/InsertEmployee', user).subscribe((data: any) => {
    },
      (error: HttpErrorResponse) => {
        console.log(error.name + ' ' + error.message);
      });
  }

  updateEmployee(user: Employee): void {
    this.dialogData = user;
    this.httpClient.put('Employee/UpdateEmployee', user).subscribe((data: any) => {
    },
      (error: HttpErrorResponse) => {
        console.log(error.name + ' ' + error.message);
      });
  }

  deleteEmployee(id: number): void {
    this.httpClient.delete('Employee/DeleteEmployee/' + id).subscribe((data: any) => {
    },
      (error: HttpErrorResponse) => {
        console.log(error.name + ' ' + error.message);
      });
  }

  setClientPerHour(id: number, perHour: number, client: number, reasonForChange: string, changeBy: number) {
    return this.httpClient.post('Employee/SetClientPerHour/' + id + '/' + perHour + '/' + client,
      { reasonForChange: reasonForChange, changeBy: changeBy })
  }

  getEmployeeBasicInfoByEmpId(id: number) {
    return this.httpClient.get('EmployeeBasicInfo/GetEmployeeBasicInfoByEmpId/' + id)
  }
  getEmployeeContactByEmpId(id: number) {
    return this.httpClient.get('EmployeeContact/GetEmployeeContactByEmpId/' + id)
  }
  getUser(id: number) {
    return this.httpClient.get('User/GetUsers/' + id)
  }

  addEmployeeBasicInfo(user: any): void {
    if (user.id == 0) {
      this.httpClient.post('EmployeeBasicInfo/InsertEmployeeBasicInfo', user).subscribe((data: any) => {
      },
        (error: HttpErrorResponse) => {
          console.log(error.name + ' ' + error.message);
        });
    } else {
      this.httpClient.put('EmployeeBasicInfo/UpdateEmployeeBasicInfo', user).subscribe((data: any) => {
      },
        (error: HttpErrorResponse) => {
          console.log(error.name + ' ' + error.message);
        });
    }
  }

  addEmployeeContact(user: any): void {
    if (user.id == 0) {
      this.httpClient.post('EmployeeContact/InsertEmployeeContact', user).subscribe((data: any) => {
      },
        (error: HttpErrorResponse) => {
          console.log(error.name + ' ' + error.message);
        });
    } else {
      this.httpClient.put('EmployeeContact/UpdateEmployeeContact', user).subscribe((data: any) => {
      },
        (error: HttpErrorResponse) => {
          console.log(error.name + ' ' + error.message);
        });
    }
  }
  addUser(user: any): void {
    if (user.id == 0) {
      this.httpClient.post('User/InsertUser', user).subscribe((data: any) => {
      },
        (error: HttpErrorResponse) => {
          console.log(error.name + ' ' + error.message);
        });
    } else {
      this.httpClient.put('User/UpdateUser', user).subscribe((data: any) => {
      },
        (error: HttpErrorResponse) => {
          console.log(error.name + ' ' + error.message);
        });
    }
  }

  getStatues() {
    return this.statuses
  }

  getEmployeeTypes() {
    return this.employeeTypes
  }

  getClients() {
    return this.clients
  }

  getProjects() {
    return this.projects
  }

  getEmployeeList() {
    return this.httpClient.get('Employee/GetEmployee')//.subscribe((data:any) => {
  }
}



