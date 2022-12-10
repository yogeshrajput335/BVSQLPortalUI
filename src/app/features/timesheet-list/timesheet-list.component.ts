import { HttpCommonService } from './../../core/services/httpCommon.service';
import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { TimesheetListDataService } from './services/timesheet-list-data.service';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { DataSource } from '@angular/cdk/collections';
import { AddTimesheetListDialogComponent } from './dialogs/add/add-timesheet-list.dialog.component';
import { EditTimesheetListDialogComponent } from './dialogs/edit/edit-timesheet-list.dialog.component';
import { DeleteTimesheetListDialogComponent } from './dialogs/delete/delete-timesheet-list.dialog.component';
import { BehaviorSubject, fromEvent, merge, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TimesheetListDataSource } from './timesheet-list-datasource';
import { TimesheetList } from './models/TimesheetList';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { Store } from '@ngrx/store';
import { increment } from 'src/app/core/store/counter.actions';
import { TimesheetDialogComponent } from './dialogs/timesheet-dialog/timesheet-dialog.dialog.component';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-timesheet-list',
  templateUrl: './timesheet-list.component.html',
  styleUrls: ['./timesheet-list.component.scss']
})

export class TimesheetListComponent implements OnInit {
  fileName = 'TimesheetList';
  displayedColumns = ['employeeName', 'projectName', 'weekEndingDate','month','year','createdDate','createdBy','duration', 'status', 'actions'];
  TimesheetListDatabase?: TimesheetListDataService | null;
  dataSource?: TimesheetListDataSource | null;
  index?: number;
  id?: number;

  constructor(public httpClient: HttpCommonService,
    public dialog: MatDialog,
    public dataService: TimesheetListDataService,
    private bottomSheet: MatBottomSheet,
    private store: Store) {
    this.store.dispatch(increment({ message: "Timesheet List" }));
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
    const dialogRef = this.dialog.open(AddTimesheetListDialogComponent, {
      data: { user: TimesheetList }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 1) {
        this.TimesheetListDatabase!.dataChange.value.push(this.dataService.getDialogData());
        this.refreshTable();
      }
    });
  }

  startEdit(i: number, id: number, employeeId: number, projectId: number, weekEndingDate: Date, month : string, year : string, createdDate : Date, createdBy : string, duration : string, status: string) {
    this.id = id;
    this.index = i;
    const dialogRef = this.dialog.open(EditTimesheetListDialogComponent, {
      data: { id: id, employeeId: employeeId, projectId: projectId, weekEndingDate : weekEndingDate,month : month,  year : year, createdDate : createdDate, createdBy : createdBy, duration : duration, status: status }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 1) {
        const foundIndex = this.TimesheetListDatabase!.dataChange.value.findIndex(x => x.id === this.id);
        this.TimesheetListDatabase!.dataChange.value[foundIndex] = this.dataService.getDialogData();
        this.refreshTable();
      }
    });
  }

  deleteItem(i: number, id: number, employeeId: number) {
    this.index = i;
    this.id = id;
    const dialogRef = this.dialog.open(DeleteTimesheetListDialogComponent, {
      data: { id: id, employeeId: employeeId }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 1) {
        const foundIndex = this.TimesheetListDatabase!.dataChange.value.findIndex(x => x.id === this.id);
        this.TimesheetListDatabase!.dataChange.value.splice(foundIndex, 1);
        this.refreshTable();
      }
    });
  }

  private refreshTable() {
    this.paginator!._changePageSize(this.paginator!.pageSize);
  }

  public loadData() {
    this.TimesheetListDatabase = new TimesheetListDataService(this.httpClient);
    this.dataSource = new TimesheetListDataSource(this.TimesheetListDatabase, this.paginator!, this.sort!);
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
      localStorage.setItem("timesheet-list-search", JSON.stringify(this.searchHistory));
    }
    if (!this.dataSource) {
      return;
    }
    this.dataSource.filter = data;
    this.bottomSheet.dismiss();
  }
  public loadSearchHistory() {
    if (localStorage.getItem("timesheet-list-search") != null) {
      this.searchHistory = JSON.parse(localStorage.getItem("timesheet-list-search")!.toString());
    }
  }
  public onClearSearchHistory() {
    localStorage.removeItem("timesheet-list-search")
    this.searchHistory = []
  }
  generateTimesheet(i: number, id: number) {
    this.index = i;
    this.id = id;
    const dialogRef = this.dialog.open(TimesheetDialogComponent, {
      data: { id: id }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 1) {
        this.loadData();
      }
    });
  }

  exportexcel(): void {
    if (this.TimesheetListDatabase && this.TimesheetListDatabase.data) {
      const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.TimesheetListDatabase.data);

      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, this.fileName + 'Data');

      XLSX.writeFile(wb, this.fileName + (new Date()).toUTCString() + ".xlsx");
    } else {
      alert('Error on export to excel.')
    }
  }
}
