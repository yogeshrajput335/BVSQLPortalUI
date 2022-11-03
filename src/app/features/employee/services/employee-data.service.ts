import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {Employee} from '../models/Employee';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import { HttpCommonService } from 'src/app/core/services/httpCommon.service';

@Injectable()
export class EmployeeDataService {
  statuses = ['ACTIVE', 'INACTIVE']
  employeeTypes = ['PERMANENT', 'CONTRACTOR']
  //employees=[{id:0,firstName:'',lastName:''}];

  dataChange: BehaviorSubject<Employee[]> = new BehaviorSubject<Employee[]>([]);
  // Temporarily stores data from dialogs
  dialogData: any;

  constructor (private httpClient: HttpCommonService) {


  }

  get data(): Employee[] {
    return this.dataChange.value;
  }

  getDialogData() {
    return this.dialogData;
  }

  /** CRUD METHODS */
  getAllEmployee(): void {
    this.httpClient.get('Employee/GetEmployee').subscribe((data:any) => {
        this.dataChange.next(data);
      },
      (error: HttpErrorResponse) => {
      console.log (error.name + ' ' + error.message);
      });
  }

  // DEMO ONLY, you can find working methods below
  addEmployee(user: Employee): void {
    this.dialogData = user;
    this.httpClient.post('Employee/InsertEmployee',user).subscribe((data:any) => {
      //this.dataChange.next(data);
    },
    (error: HttpErrorResponse) => {
    console.log (error.name + ' ' + error.message);
    });
  }

  updateEmployee(user: Employee): void {
    this.dialogData = user;
    this.httpClient.put('Employee/UpdateEmployee',user).subscribe((data:any) => {
      //this.dataChange.next(data);
    },
    (error: HttpErrorResponse) => {
    console.log (error.name + ' ' + error.message);
    });
  }

  deleteEmployee(id: number): void {
    console.log(id);
    this.httpClient.delete('Employee/DeleteEmployee/'+id).subscribe((data:any) => {
      //this.dataChange.next(data);
    },
    (error: HttpErrorResponse) => {
    console.log (error.name + ' ' + error.message);
    });
  }

  getEmployeeBasicInfoByEmpId(id:number) {
    return this.httpClient.get('EmployeeBasicInfo/GetEmployeeBasicInfoByEmpId/'+id)
  }
  getEmployeeContactByEmpId(id:number) {
    return this.httpClient.get('EmployeeContact/GetEmployeeContactByEmpId/'+id)
  }
  //addEmployeeBasicInfo
  addEmployeeBasicInfo(user: any): void {
    if(user.id==0){
      this.httpClient.post('EmployeeBasicInfo/InsertEmployeeBasicInfo',user).subscribe((data:any) => {
        //this.dataChange.next(data);
      },
      (error: HttpErrorResponse) => {
      console.log (error.name + ' ' + error.message);
      });
    } else {
      this.httpClient.put('EmployeeBasicInfo/UpdateEmployeeBasicInfo',user).subscribe((data:any) => {
        //this.dataChange.next(data);
      },
      (error: HttpErrorResponse) => {
      console.log (error.name + ' ' + error.message);
      });
    }
  }

  addEmployeeContact(user: any): void {
    if(user.id==0){
      this.httpClient.post('EmployeeContact/InsertEmployeeContact',user).subscribe((data:any) => {
        //this.dataChange.next(data);
      },
      (error: HttpErrorResponse) => {
      console.log (error.name + ' ' + error.message);
      });
    } else {
      this.httpClient.put('EmployeeContact/UpdateEmployeeContact',user).subscribe((data:any) => {
        //this.dataChange.next(data);
      },
      (error: HttpErrorResponse) => {
      console.log (error.name + ' ' + error.message);
      });
    }
  }

  getStatues(){
    return this.statuses
  }
  getEmployeeTypes(){
    return this.employeeTypes
  }
  getEmployeeList(){
    // console.log(this.employees)
    // return  this.employees;
    return this.httpClient.get('Employee/GetEmployee')//.subscribe((data:any) => {
      // this.employees = data;

      // },
      // (error: HttpErrorResponse) => {
      // console.log (error.name + ' ' + error.message);
      // });

  }
}



/* REAL LIFE CRUD Methods I've used in my projects. ToasterService uses Material Toasts for displaying messages:

    // ADD, POST METHOD
    addItem(kanbanItem: KanbanItem): void {
    this.httpClient.post(this.API_URL, kanbanItem).subscribe(data => {
      this.dialogData = kanbanItem;
      this.toasterService.showToaster('Successfully added', 3000);
      },
      (err: HttpErrorResponse) => {
      this.toasterService.showToaster('Error occurred. Details: ' + err.name + ' ' + err.message, 8000);
    });
   }

    // UPDATE, PUT METHOD
     updateItem(kanbanItem: KanbanItem): void {
    this.httpClient.put(this.API_URL + kanbanItem.id, kanbanItem).subscribe(data => {
        this.dialogData = kanbanItem;
        this.toasterService.showToaster('Successfully edited', 3000);
      },
      (err: HttpErrorResponse) => {
        this.toasterService.showToaster('Error occurred. Details: ' + err.name + ' ' + err.message, 8000);
      }
    );
  }

  // DELETE METHOD
  deleteItem(id: number): void {
    this.httpClient.delete(this.API_URL + id).subscribe(data => {
      console.log(data['']);
        this.toasterService.showToaster('Successfully deleted', 3000);
      },
      (err: HttpErrorResponse) => {
        this.toasterService.showToaster('Error occurred. Details: ' + err.name + ' ' + err.message, 8000);
      }
    );
  }
*/




