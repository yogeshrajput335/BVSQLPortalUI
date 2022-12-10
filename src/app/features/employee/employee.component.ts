import { HttpCommonService } from './../../core/services/httpCommon.service';
import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { EmployeeDataService } from './services/employee-data.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Employee } from './models/Employee';
import { DataSource } from '@angular/cdk/collections';
import { BehaviorSubject, fromEvent, merge, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { EmployeeDataSource } from './employee-datasource';
import { AddEmployeeDialogComponent } from './dialogs/add/add-employee.dialog.component';
import { EditEmployeeDialogComponent } from './dialogs/edit/edit-employee.dialog.component';
import { DeleteEmployeeDialogComponent } from './dialogs/delete/delete-employee.dialog.component';
import { SetClientPerHourDialogComponent } from './dialogs/set-ClientPerHour/set-clientperhour.dialog.component';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { Store } from '@ngrx/store';
import { increment } from 'src/app/core/store/counter.actions';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.scss']
})
export class EmployeeComponent implements OnInit {
  fileName = 'Employee';
  displayedColumns = ['firstName', 'lastName', 'email', 'phoneNumber', 'employeeType', 'status', 'actions'];
  userDatabase?: EmployeeDataService | null;
  dataSource?: EmployeeDataSource | null;
  index?: number;
  id?: number;
  employees = [{ id: 0, firstName: '', lastName: '' }]
  basicInfo: any = { id: 0, employeeId: '', fatherName: '', mothername: '', bloodGroup: '', personalEmailId: '', dateOfBirth: '', isMarried: false, maritalStatus: '', spouseName: '', permanentAddress: '', isBothAddressSame: false, currentAddress: '', gender: '' };
  contact: any = { id: 0, employeeId: '', personalEmailId: '', phoneNumber: '', workEmail: '', emergencyContactName: '', emergencyContactNumber: '' };
  user: any = { id: 0, employeeId: '', userType: '', userName: '', password: '', email: '', status: '' };
  selectedTab = 0;
  constructor(public httpClient: HttpCommonService,
    public dialog: MatDialog,
    public dataService: EmployeeDataService,
    private bottomSheet: MatBottomSheet,
    private store: Store) {
    this.store.dispatch(increment({ message: "Employee" }));
  }

  @ViewChild(MatPaginator, { static: true }) paginator?: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort?: MatSort;
  @ViewChild('filter', { static: true }) filter?: ElementRef;
  @ViewChild('templateBottomSheet') TemplateBottomSheet: TemplateRef<any> | undefined;

  ngOnInit() {
    this.loadData();
    this.loadSearchHistory();
    this.dataService.getEmployeeList().subscribe((data: any) => {
      this.employees = data;

    },
      (error: HttpErrorResponse) => {
        console.log(error.name + ' ' + error.message);
      });;
  }

  refresh() {
    this.loadData();
  }

  addNew() {
    const dialogRef = this.dialog.open(AddEmployeeDialogComponent, {
      data: { user: Employee }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 1) {
        this.userDatabase!.dataChange.value.push(this.dataService.getDialogData());
        this.refreshTable();
      }
    });
  }

  startEdit(i: number, id: number, firstName: string, lastName: string, email: string, phoneNumber: string, employeeType: string, status: string) {
    this.id = id;
    this.index = i;
    const dialogRef = this.dialog.open(EditEmployeeDialogComponent, {
      data: { id: id, firstName: firstName, lastName: lastName, email: email, phoneNumber: phoneNumber, employeeType: employeeType, status: status }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 1) {
        const foundIndex = this.userDatabase!.dataChange.value.findIndex(x => x.id === this.id);
        this.userDatabase!.dataChange.value[foundIndex] = this.dataService.getDialogData();
        this.refreshTable();
      }
    });
  }

  deleteItem(i: number, id: number, firstName: string, lastName: string) {
    this.index = i;
    this.id = id;
    const dialogRef = this.dialog.open(DeleteEmployeeDialogComponent, {
      data: { id: id, firstName: firstName, lastName: lastName }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 1) {
        const foundIndex = this.userDatabase!.dataChange.value.findIndex(x => x.id === this.id);
        this.userDatabase!.dataChange.value.splice(foundIndex, 1);
        this.refreshTable();
      }
    });
  }

  setClientPerHour(i: number, id: number, perHour: number, firstName: string, lastName: string) {
    this.index = i;
    this.id = id;
    const dialogRef = this.dialog.open(SetClientPerHourDialogComponent, {
      data: { id: id, perHour: perHour, firstName: firstName, lastName: lastName }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 1) {
        this.loadData();
      }
    });
  }


  private refreshTable() {
    this.paginator!._changePageSize(this.paginator!.pageSize);
  }

  public loadData() {
    this.userDatabase = new EmployeeDataService(this.httpClient);
    this.dataSource = new EmployeeDataSource(this.userDatabase, this.paginator!, this.sort!);
    fromEvent(this.filter!.nativeElement, 'keyup')
      .subscribe(() => {
        if (!this.dataSource) {
          return;
        }
        this.dataSource.filter = this.filter!.nativeElement.value;
      });
  }

  onChangeEmployee(event: any) {
    this.showBasic(event.value);
  }

  onChangeEmployee_Contact(event: any) {
    this.showContact(event.value);
  }

  onChangeUser(event: any) {
    this.showUser(event.value);
  }

  submit() {

  }

  confirmAddBasicInfo() {
    this.dataService.addEmployeeBasicInfo(this.basicInfo);
  }

  confirmAddContact() {
    this.dataService.addEmployeeContact(this.contact);
  }

  confirmAddUser() {
    this.dataService.addUser(this.user);
  }

  showBasic(empid: number) {
    this.dataService.getEmployeeBasicInfoByEmpId(empid).subscribe((data: any) => {
      this.basicInfo = data;
      this.selectedTab = 1;
    },
      (error: HttpErrorResponse) => {
        console.log(error.name + ' ' + error.message);
      });
  }

  showContact(empid: number) {
    this.dataService.getEmployeeContactByEmpId(empid).subscribe((data: any) => {
      this.contact = data;
      this.selectedTab = 2;
    },
      (error: HttpErrorResponse) => {
        console.log(error.name + ' ' + error.message);
      });
  }

  showUser(empid: number) {
    this.dataService.getUser(empid).subscribe((data: any) => {
      this.user = data;
      this.selectedTab = 3;
    },
      (error: HttpErrorResponse) => {
        console.log(error.name + ' ' + error.message);
      });
  }

  public openSearchFilter() {
    if (this.TemplateBottomSheet)
      this.bottomSheet.open(this.TemplateBottomSheet);
  }
  public closeSearchFilter() {
    this.bottomSheet.dismiss();
  }
  searchHistory: string[] = []
  public onSearchFilter(data: any) {
    if (data.trim() != "") {
      this.searchHistory = []
      this.loadSearchHistory()
      if (!this.searchHistory.includes(data)) {
        this.searchHistory.push(data);
      } else {
        this.searchHistory = this.searchHistory.filter(i => i !== data)
        this.searchHistory.push(data);
      }
      localStorage.setItem("employee-search", JSON.stringify(this.searchHistory));
    }
    if (!this.dataSource) {
      return;
    }
    this.dataSource.filter = data;
    this.bottomSheet.dismiss();
  }
  public loadSearchHistory() {
    if (localStorage.getItem("employee-search") != null) {
      this.searchHistory = JSON.parse(localStorage.getItem("employee-search")!.toString());
    }
  }
  public onClearSearchHistory() {
    localStorage.removeItem("employee-search")
    this.searchHistory = []
  }

  exportexcel(): void {
    if (this.userDatabase && this.userDatabase.data) {
      const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.userDatabase.data);

      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, this.fileName + 'Data');

      XLSX.writeFile(wb, this.fileName + (new Date()).toUTCString() + ".xlsx");
    } else {
      alert('Error on export to excel.')
    }
  }
}
