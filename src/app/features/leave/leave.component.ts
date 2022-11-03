import { Leave } from './models/Leave';
import { HttpCommonService } from './../../core/services/httpCommon.service';
import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {LeaveDataService} from './services/leave-data.service';
import {HttpClient} from '@angular/common/http';
import {MatDialog} from '@angular/material/dialog';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {DataSource} from '@angular/cdk/collections';
import {AddLeaveDialogComponent} from './dialogs/add/add-leave.dialog.component';
import {EditLeaveDialogComponent} from './dialogs/edit/edit-leave.dialog.component';
import {DeleteLeaveDialogComponent} from './dialogs/delete/delete-leave.dialog.component';
import {BehaviorSubject, fromEvent, merge, Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import { LeaveDataSource } from './leave-datasource';

@Component({
  selector: 'app-leave',
  templateUrl: './leave.component.html',
  styleUrls: ['./leave.component.scss']
})
export class LeaveComponent implements OnInit {
  displayedColumns = ['fullName', 'leaveType','fromDate', 'toDate', 'reason', 'status', 'actions'];
  LeaveDatabase?: LeaveDataService | null;
  dataSource?: LeaveDataSource | null;
  index?: number;
  id?: number;

  constructor(public httpClient: HttpCommonService,
              public dialog: MatDialog,
              public dataService: LeaveDataService) {}

  @ViewChild(MatPaginator, {static: true}) paginator?: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort?: MatSort;
  @ViewChild('filter',  {static: true}) filter?: ElementRef;

  ngOnInit() {
    this.loadData();
  }

  refresh() {
    this.loadData();
  }

  addNew() {
    const dialogRef = this.dialog.open(AddLeaveDialogComponent, {
      data: {user: Leave }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 1) {
        this.LeaveDatabase!.dataChange.value.push(this.dataService.getDialogData());
        this.refreshTable();
      }
    });
  }

  startEdit(i: number, id: number, employeeId: number, leaveTypeId: number, fromDate: Date,toDate:Date, reason :string, status: string) {
    this.id = id;
    this.index = i;
    console.log(this.index);
    const dialogRef = this.dialog.open(EditLeaveDialogComponent, {
      data: {id: id, employeeId: employeeId, leaveTypeId: leaveTypeId, fromDate: fromDate, toDate: toDate, reason: reason, status: status}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 1) {
        const foundIndex = this.LeaveDatabase!.dataChange.value.findIndex(x => x.id === this.id);
        this.LeaveDatabase!.dataChange.value[foundIndex] = this.dataService.getDialogData();
        this.refreshTable();
      }
    });
  }

  deleteItem(i: number, id: number, leaveType: string, fullName: string, fromDate: Date, toDate: Date,reason:string) {
    this.index = i;
    this.id = id;
    const dialogRef = this.dialog.open(DeleteLeaveDialogComponent, {
      data: {id: id, leaveType: leaveType, fullName: fullName,fromDate:fromDate,toData:toDate,reason:reason}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 1) {
        const foundIndex = this.LeaveDatabase!.dataChange.value.findIndex(x => x.id === this.id);
        this.LeaveDatabase!.dataChange.value.splice(foundIndex, 1);
        this.refreshTable();
      }
    });
  }


  private refreshTable() {
    this.paginator!._changePageSize(this.paginator!.pageSize);
  }

  public loadData() {
    this.LeaveDatabase = new LeaveDataService(this.httpClient);
    this.dataSource = new LeaveDataSource(this.LeaveDatabase, this.paginator!, this.sort!);
    fromEvent(this.filter!.nativeElement, 'keyup')
      .subscribe(() => {
        if (!this.dataSource) {
          return;
        }
        this.dataSource.filter = this.filter!.nativeElement.value;
      });
  }
}

