import { Holiday } from './models/Holiday';
import { HttpCommonService } from './../../core/services/httpCommon.service';
import { Component, ElementRef, OnInit, TemplateRef, ViewChild, } from '@angular/core';
import { HolidayDataService } from './services/holiday-data.service';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { DataSource } from '@angular/cdk/collections';
import { AddHolidayDialogComponent } from './dialogs/add/add-holiday.dialog.component';
import { EditHolidayDialogComponent } from './dialogs/edit/edit-holiday.dialog.component';
import { DeleteHolidayDialogComponent } from './dialogs/delete/delete-holiday.dialog.component';
import { BehaviorSubject, fromEvent, merge, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HolidayDataSource } from './holiday-datasource';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { Store } from '@ngrx/store';
import { increment } from 'src/app/core/store/counter.actions';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-holiday',
  templateUrl: './holiday.component.html',
  styleUrls: ['./holiday.component.scss']
})
export class HolidayComponent implements OnInit {
  fileName= 'Holiday';
  displayedColumns = ['holidayName', 'date', 'description', 'status', 'actions'];
  leaveTypeDatabase?: HolidayDataService | null;
  dataSource?: HolidayDataSource | null;
  index?: number;
  id?: number;
  userType: any

  constructor(public httpClient: HttpCommonService,
    public dialog: MatDialog,
    public dataService: HolidayDataService,
    private authService: AuthenticationService,
    private bottomSheet: MatBottomSheet,
    private store: Store) {
    this.userType = this.authService.getUser().userType;
    this.store.dispatch(increment({ message: "Holiday" }));
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
    const dialogRef = this.dialog.open(AddHolidayDialogComponent, {
      data: { user: Holiday }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 1) {
        this.leaveTypeDatabase!.dataChange.value.push(this.dataService.getDialogData());
        this.refreshTable();
      }
    });
  }

  startEdit(i: number, id: number, holidayName: string, description: string, date: Date, status: string) {
    this.id = id;
    this.index = i;
    const dialogRef = this.dialog.open(EditHolidayDialogComponent, {
      data: { id: id, holidayName: holidayName, description: description, date: date, status: status }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 1) {
        const foundIndex = this.leaveTypeDatabase!.dataChange.value.findIndex(x => x.id === this.id);
        this.leaveTypeDatabase!.dataChange.value[foundIndex] = this.dataService.getDialogData();
        this.refreshTable();
      }
    });
  }

  deleteItem(i: number, id: number, holidayName: string, date: Date) {
    this.index = i;
    this.id = id;
    const dialogRef = this.dialog.open(DeleteHolidayDialogComponent, {
      data: { id: id, holidayName: holidayName, date: date }
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
    this.leaveTypeDatabase = new HolidayDataService(this.httpClient);
    this.dataSource = new HolidayDataSource(this.leaveTypeDatabase, this.paginator!, this.sort!);
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
      localStorage.setItem("holiday-search", JSON.stringify(this.searchHistory));
    }
    if (!this.dataSource) {
      return;
    }
    this.dataSource.filter = data;
    this.bottomSheet.dismiss();
  }
  public loadSearchHistory() {
    if (localStorage.getItem("holiday-search") != null) {
      this.searchHistory = JSON.parse(localStorage.getItem("holiday-search")!.toString());
    }
  }
  public onClearSearchHistory() {
    localStorage.removeItem("holiday-search")
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

