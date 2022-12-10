import { HttpCommonService } from './../../core/services/httpCommon.service';
import { Component, ElementRef, OnInit,TemplateRef, ViewChild } from '@angular/core';
import { UserDataService } from './services/user-data.service';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { User } from './models/User';
import { DataSource } from '@angular/cdk/collections';
import { AddUserDialogComponent } from './dialogs/add/add-user.dialog.component';
import { EditUserDialogComponent } from './dialogs/edit/edit-user.dialog.component';
import { DeleteUserDialogComponent } from './dialogs/delete/delete-user.dialog.component';
import { BehaviorSubject, fromEvent, merge, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserDataSource } from './user-datasource';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { Store } from '@ngrx/store';
import { increment } from 'src/app/core/store/counter.actions';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  fileName= 'Users';
  displayedColumns = ['employee', 'userType', 'username', 'password', 'email', 'status', 'actions'];
  userDatabase?: UserDataService;
  dataSource?: UserDataSource | null;
  index?: number;
  id?: number;

  constructor(public httpClient: HttpCommonService,
    public dialog: MatDialog,
    public dataService: UserDataService,
    private bottomSheet: MatBottomSheet,
    private store: Store ) {
      this.store.dispatch(increment({message:"User"}));
     }

  @ViewChild(MatPaginator, { static: true }) paginator?: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort?: MatSort;
  @ViewChild('filter', { static: true }) filter?: ElementRef;
  @ViewChild('templateBottomSheet') TemplateBottomSheet: TemplateRef<any> | undefined;

  ngOnInit() {
    this.loadData();
    this.loadSearchHistory();
  }

  refresh() {
    this.loadData();
  }

  addNew() {
    const dialogRef = this.dialog.open(AddUserDialogComponent, {
      data: { user: User }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 1) {
        this.userDatabase!.dataChange.value.push(this.dataService.getDialogData());
        this.refreshTable();
      }
    });
  }

  startEdit(i: number, id: number, username: string, password: string, email: string, userType: string, status: string) {
    this.id = id;
    this.index = i;
    const dialogRef = this.dialog.open(EditUserDialogComponent, {
      data: { id: id, username: username, password: password, email: email, userType: userType, status: status }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 1) {
        const foundIndex = this.userDatabase!.dataChange.value.findIndex(x => x.id === this.id);
        this.userDatabase!.dataChange.value[foundIndex] = this.dataService.getDialogData();
        this.refreshTable();
      }
    });
  }

  deleteItem(i: number, id: number, username: string) {
    this.index = i;
    this.id = id;
    const dialogRef = this.dialog.open(DeleteUserDialogComponent, {
      data: { id: id, username: username }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 1) {
        const foundIndex = this.userDatabase!.dataChange.value.findIndex(x => x.id === this.id);
        this.userDatabase!.dataChange.value.splice(foundIndex, 1);
        this.refreshTable();
      }
    });
  }


  private refreshTable() {
    this.paginator!._changePageSize(this.paginator!.pageSize);
  }

  public loadData() {
    this.userDatabase = new UserDataService(this.httpClient);
    this.dataSource = new UserDataSource(this.userDatabase, this.paginator!, this.sort!);
    fromEvent(this.filter!.nativeElement, 'keyup')
      .subscribe(() => {
        if (!this.dataSource) {
          return;
        }
        this.dataSource.filter = this.filter!.nativeElement.value;
      });
  }

  public openSearchFilter(){
		if(this.TemplateBottomSheet)
		this.bottomSheet.open(this.TemplateBottomSheet);
	  }
	  public closeSearchFilter(){
		this.bottomSheet.dismiss();
	  }
	  searchHistory:string[] =[]
	  public onSearchFilter(data:any){
		if(data.trim() != ""){
		  this.searchHistory =[]
		  this.loadSearchHistory()
		  if(!this.searchHistory.includes(data)){
			this.searchHistory.push(data);
		  } else {
			this.searchHistory = this.searchHistory.filter(i => i !== data)
			this.searchHistory.push(data);
		  }
		  localStorage.setItem("user-search", JSON.stringify(this.searchHistory));
		}
		if (!this.dataSource) {
		  return;
		}
		this.dataSource.filter = data;
		this.bottomSheet.dismiss();
	  }
	  public loadSearchHistory(){
		if (localStorage.getItem("user-search") != null) {
		  this.searchHistory =  JSON.parse(localStorage.getItem("user-search")!.toString());
		}
	  }
	  public onClearSearchHistory(){
		localStorage.removeItem("user-search")
		this.searchHistory=[]
	  }
  exportexcel(): void
  {
    if(this.userDatabase && this.userDatabase.data){
    const ws: XLSX.WorkSheet =XLSX.utils.json_to_sheet(this.userDatabase.data);

    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, this.fileName + 'Data');

    /* save to file */
    XLSX.writeFile(wb, this.fileName+(new Date()).toUTCString()+".xlsx");
    } else {
      alert('Error on export to excel.')
    }

  }
}
