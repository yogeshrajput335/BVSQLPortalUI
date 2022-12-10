import { LeaveType } from './models/LeaveType';
import { HttpCommonService } from './../../core/services/httpCommon.service';
import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { LeaveTypeDataService } from './services/leave-type-data.service';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { DataSource } from '@angular/cdk/collections';
import { AddLeaveTypeDialogComponent } from './dialogs/add/add-leave-type.dialog.component';
import { EditLeaveTypeDialogComponent } from './dialogs/edit/edit-leave-type.dialog.component';
import { DeleteLeaveTypeDialogComponent } from './dialogs/delete/delete-leave-type.dialog.component';
import { BehaviorSubject, fromEvent, merge, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { LeaveTypeDataSource } from './leave-type-datasource';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { Store } from '@ngrx/store';
import { increment } from 'src/app/core/store/counter.actions';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-leave-type',
  templateUrl: './leave-type.component.html',
  styleUrls: ['./leave-type.component.scss']
})
export class LeaveTypeComponent implements OnInit {
  fileName= 'LeaveType';
  displayedColumns = ['type', 'description', 'status', 'actions'];
  leaveTypeDatabase?: LeaveTypeDataService | null;
  dataSource?: LeaveTypeDataSource | null;
  index?: number;
  id?: number;

  constructor(public httpClient: HttpCommonService,
    public dialog: MatDialog,
    public dataService: LeaveTypeDataService,
    private bottomSheet: MatBottomSheet,
    private store: Store) {
    this.store.dispatch(increment({ message: "Leave Type" }));
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
    const dialogRef = this.dialog.open(AddLeaveTypeDialogComponent, {
      data: { user: LeaveType }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 1) {
        this.leaveTypeDatabase!.dataChange.value.push(this.dataService.getDialogData());
        this.refreshTable();
      }
    });
  }

  startEdit(i: number, id: number, type: string, description: string, status: string) {
    this.id = id;
    this.index = i;
    const dialogRef = this.dialog.open(EditLeaveTypeDialogComponent, {
      data: { id: id, type: type, description: description, status: status }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 1) {
        const foundIndex = this.leaveTypeDatabase!.dataChange.value.findIndex(x => x.id === this.id);
        this.leaveTypeDatabase!.dataChange.value[foundIndex] = this.dataService.getDialogData();
        this.refreshTable();
      }
    });
  }

  deleteItem(i: number, id: number, type: string) {
    this.index = i;
    this.id = id;
    const dialogRef = this.dialog.open(DeleteLeaveTypeDialogComponent, {
      data: { id: id, type: type }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 1) {
        const foundIndex = this.leaveTypeDatabase!.dataChange.value.findIndex(x => x.id === this.id);
        this.leaveTypeDatabase!.dataChange.value.splice(foundIndex, 1);
        this.refreshTable();
      }
    });
  }

  private refreshTable() {
    this.paginator!._changePageSize(this.paginator!.pageSize);
  }

  public loadData() {
    this.leaveTypeDatabase = new LeaveTypeDataService(this.httpClient);
    this.dataSource = new LeaveTypeDataSource(this.leaveTypeDatabase, this.paginator!, this.sort!);
    fromEvent(this.filter!.nativeElement, 'keyup')
      .subscribe(() => {
        if (!this.dataSource) {
          return;
        }
        this.dataSource.filter = this.filter!.nativeElement.value;
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
      localStorage.setItem("leave-type-search", JSON.stringify(this.searchHistory));
    }
    if (!this.dataSource) {
      return;
    }
    this.dataSource.filter = data;
    this.bottomSheet.dismiss();
  }
  public loadSearchHistory() {
    if (localStorage.getItem("leave-type-search") != null) {
      this.searchHistory = JSON.parse(localStorage.getItem("leave-type-search")!.toString());
    }
  }
  public onClearSearchHistory() {
    localStorage.removeItem("leave-type-search")
    this.searchHistory = []
  }

  exportexcel(): void
  {
    if(this.leaveTypeDatabase && this.leaveTypeDatabase.data){
    const ws: XLSX.WorkSheet =XLSX.utils.json_to_sheet(this.leaveTypeDatabase.data);
    
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, this.fileName + 'Data');
    
    XLSX.writeFile(wb, this.fileName+(new Date()).toUTCString()+".xlsx");
    } else {
      alert('Error on export to excel.')
    }
}
}

