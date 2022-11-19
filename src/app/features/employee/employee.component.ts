import { HttpCommonService } from './../../core/services/httpCommon.service';
import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {EmployeeDataService} from './services/employee-data.service';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {MatDialog} from '@angular/material/dialog';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {Employee} from './models/Employee';
import {DataSource} from '@angular/cdk/collections';
import {BehaviorSubject, fromEvent, merge, Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import { EmployeeDataSource } from './employee-datasource';
import { AddEmployeeDialogComponent } from './dialogs/add/add-employee.dialog.component';
import { EditEmployeeDialogComponent } from './dialogs/edit/edit-employee.dialog.component';
import { DeleteEmployeeDialogComponent } from './dialogs/delete/delete-employee.dialog.component';
import { SetClientPerHourDialogComponent } from './dialogs/set-ClientPerHour/set-clientperhour.dialog.component';


@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.scss']
})
export class EmployeeComponent implements OnInit {
  displayedColumns = ['firstName', 'lastName', 'email', 'phoneNumber', 'employeeType', 'status', 'actions'];
  userDatabase?: EmployeeDataService | null;
  dataSource?: EmployeeDataSource | null;
  index?: number;
  id?: number;
  employees=[{id:0,firstName:'',lastName:''}]
  basicInfo: any = {id:0,employeeId:'',fatherName:'',mothername:'',bloodGroup:'',personalEmailId:'',dateOfBirth:'',isMarried:false,maritalStatus:'',spouseName:'',permanentAddress:'',isBothAddressSame:false,currentAddress:'',gender:''};
  contact: any = {id:0,employeeId:'',personalEmailId:'',phoneNumber:'',workEmail:'',emergencyContactName:'',emergencyContactNumber:''};
  user: any ={id:0,employeeId:'',userType:'',userName:'',password:'',email:'',status:''};
  selectedTab=0;
  constructor(public httpClient: HttpCommonService,
              public dialog: MatDialog,
              public dataService: EmployeeDataService) {

              }

  @ViewChild(MatPaginator, {static: true}) paginator?: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort?: MatSort;
  @ViewChild('filter',  {static: true}) filter?: ElementRef;

  ngOnInit() {
    this.loadData();
    this.dataService.getEmployeeList().subscribe((data:any) => {
      this.employees = data;

      },
      (error: HttpErrorResponse) => {
      console.log (error.name + ' ' + error.message);
      });;


  }

  refresh() {
    this.loadData();
  }

  addNew() {
    const dialogRef = this.dialog.open(AddEmployeeDialogComponent, {
      data: {user: Employee }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 1) {
        // After dialog is closed we're doing frontend updates
        // For add we're just pushing a new row inside UserDataService
        this.userDatabase!.dataChange.value.push(this.dataService.getDialogData());
        this.refreshTable();
      }
    });
  }

  startEdit(i: number, id: number, firstName: string, lastName: string, email: string, phoneNumber: string, employeeType: string, status: string) {
    this.id = id;
    // index row is used just for debugging proposes and can be removed
    this.index = i;
    const dialogRef = this.dialog.open(EditEmployeeDialogComponent, {
      data: {id: id, firstName: firstName, lastName: lastName, email: email, phoneNumber: phoneNumber,employeeType: employeeType, status: status}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 1) {
        // When using an edit things are little different, firstly we find record inside UserDataService by id
        const foundIndex = this.userDatabase!.dataChange.value.findIndex(x => x.id === this.id);
        // Then you update that record using data from dialogData (values you enetered)
        this.userDatabase!.dataChange.value[foundIndex] = this.dataService.getDialogData();
        // And lastly refresh table
        this.refreshTable();
      }
    });
  }

  deleteItem(i: number, id: number, firstName: string, lastName: string) {
    this.index = i;
    this.id = id;
    const dialogRef = this.dialog.open(DeleteEmployeeDialogComponent, {
      data: {id: id, firstName: firstName, lastName: lastName}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 1) {
        const foundIndex = this.userDatabase!.dataChange.value.findIndex(x => x.id === this.id);
        // for delete we use splice in order to remove single object from UserDataService
        this.userDatabase!.dataChange.value.splice(foundIndex, 1);
        this.refreshTable();
      }
    });
  }

  setClientPerHour(i: number, id: number, perHour: number, firstName: string, lastName: string) {
    this.index = i;
    this.id = id;
    const dialogRef = this.dialog.open(SetClientPerHourDialogComponent, {
      data: {id: id,perHour: perHour,firstName: firstName,lastName: lastName}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 1) {
        // const foundIndex = this.ClientDatabase!.dataChange.value.findIndex(x => x.id === this.id);
        // this.ClientDatabase!.dataChange.value.splice(foundIndex, 1);
        this.loadData();
      }
    });
  }


  private refreshTable() {
    // Refreshing table using paginator
    // Thanks yeager-j for tips
    // https://github.com/marinantonio/angular-mat-table-crud/issues/12
    this.paginator!._changePageSize(this.paginator!.pageSize);
  }


  /*   // If you don't need a filter or a pagination this can be simplified, you just use code from else block
    // OLD METHOD:
    // if there's a paginator active we're using it for refresh
    if (this.dataSource._paginator.hasNextPage()) {
      this.dataSource._paginator.nextPage();
      this.dataSource._paginator.previousPage();
      // in case we're on last page this if will tick
    } else if (this.dataSource._paginator.hasPreviousPage()) {
      this.dataSource._paginator.previousPage();
      this.dataSource._paginator.nextPage();
      // in all other cases including active filter we do it like this
    } else {
      this.dataSource.filter = '';
      this.dataSource.filter = this.filter.nativeElement.value;
    }*/



  public loadData() {
    this.userDatabase = new EmployeeDataService(this.httpClient);
    this.dataSource = new EmployeeDataSource(this.userDatabase, this.paginator!, this.sort!);
    fromEvent(this.filter!.nativeElement, 'keyup')
      // .debounceTime(150)
      // .distinctUntilChanged()
      .subscribe(() => {
        if (!this.dataSource) {
          return;
        }
        this.dataSource.filter = this.filter!.nativeElement.value;
      });
  }

  onChangeEmployee(event:any) {
    this.showBasic(event.value);
    // this.dataService.getEmployeeBasicInfoByEmpId(event.value).subscribe((data:any) => {
    //   this.basicInfo = data;
    //   },
    //   (error: HttpErrorResponse) => {
    //   console.log (error.name + ' ' + error.message);
    //   });
  }
  onChangeEmployee_Contact(event:any) {
    this.showContact(event.value);
    // this.dataService.getEmployeeContactByEmpId(event.value).subscribe((data:any) => {
    //   this.contact = data;
    //   },
    //   (error: HttpErrorResponse) => {
    //   console.log (error.name + ' ' + error.message);
    //   });
  }
  onChangeUser(event:any) {
    this.showUser(event.value);
  }
  submit() {
  // empty stuff
  }
  confirmAddBasicInfo(){
    this.dataService.addEmployeeBasicInfo(this.basicInfo);
  }
  confirmAddContact(){
    this.dataService.addEmployeeContact(this.contact);
  }
  confirmAddUser(){
    this.dataService.addUser(this.user);
  }
  showBasic(empid :number){
    this.dataService.getEmployeeBasicInfoByEmpId(empid).subscribe((data:any) => {
      this.basicInfo = data;
      this.selectedTab = 1;
      },
      (error: HttpErrorResponse) => {
      console.log (error.name + ' ' + error.message);
      });
  }
  showContact(empid :number){
    this.dataService.getEmployeeContactByEmpId(empid).subscribe((data:any) => {
      this.contact = data;
      this.selectedTab = 2;
      },
      (error: HttpErrorResponse) => {
      console.log (error.name + ' ' + error.message);
      });
  }
  showUser(empid :number){
    this.dataService.getUser(empid).subscribe((data:any) => {
      this.user = data;
      this.selectedTab = 3;
      },
      (error: HttpErrorResponse) => {
      console.log (error.name + ' ' + error.message);
      });
  }
}
