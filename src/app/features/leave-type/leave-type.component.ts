import { LeaveType } from './models/LeaveType';
import { HttpCommonService } from './../../core/services/httpCommon.service';
import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {LeaveTypeDataService} from './services/leave-type-data.service';
import {HttpClient} from '@angular/common/http';
import {MatDialog} from '@angular/material/dialog';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {DataSource} from '@angular/cdk/collections';
import {AddLeaveTypeDialogComponent} from './dialogs/add/add-leave-type.dialog.component';
import {EditLeaveTypeDialogComponent} from './dialogs/edit/edit-leave-type.dialog.component';
import {DeleteLeaveTypeDialogComponent} from './dialogs/delete/delete-leave-type.dialog.component';
import {BehaviorSubject, fromEvent, merge, Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import { LeaveTypeDataSource } from './leave-type-datasource';

@Component({
  selector: 'app-leave-type',
  templateUrl: './leave-type.component.html',
  styleUrls: ['./leave-type.component.scss']
})
export class LeaveTypeComponent implements OnInit {
  displayedColumns = ['type', 'description', 'status', 'actions'];
  leaveTypeDatabase?: LeaveTypeDataService | null;
  dataSource?: LeaveTypeDataSource | null;
  index?: number;
  id?: number;

  constructor(public httpClient: HttpCommonService,
              public dialog: MatDialog,
              public dataService: LeaveTypeDataService) {}

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
    const dialogRef = this.dialog.open(AddLeaveTypeDialogComponent, {
      data: {user: LeaveType }
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
    console.log(this.index);
    const dialogRef = this.dialog.open(EditLeaveTypeDialogComponent, {
      data: {id: id, type: type, description: description, status: status}
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
      data: {id: id, type: type}
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
}

