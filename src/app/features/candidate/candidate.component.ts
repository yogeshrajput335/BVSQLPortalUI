import { Candidate } from './models/Candidate';
import { HttpCommonService } from './../../core/services/httpCommon.service';
import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {CandidateDataService} from './services/candidate-data.service';
import {HttpClient} from '@angular/common/http';
import {MatDialog} from '@angular/material/dialog';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {DataSource} from '@angular/cdk/collections';
import {AddCandidateDialogComponent} from './dialogs/add/add-candidate.dialog.component';
import {EditCandidateDialogComponent} from './dialogs/edit/edit-candidate.dialog.component';
import {DeleteCandidateDialogComponent} from './dialogs/delete/delete-candidate.dialog.component';
import {BehaviorSubject, fromEvent, merge, Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import { CandidateDataSource } from './candidate-datasource';

@Component({
  selector: 'app-candidate',
  templateUrl: './candidate.component.html',
  styleUrls: ['./candidate.component.scss']
})
export class CandidateComponent implements OnInit {
  displayedColumns = ['firstName', 'lastName', 'phoneNo','email', 'status', 'referByName', 'actions'];
  CandidateDatabase?: CandidateDataService | null;
  dataSource?: CandidateDataSource | null;
  index?: number;
  id?: number;


  constructor(
    public httpClient: HttpCommonService,
              public dialog: MatDialog,
              public dataService: CandidateDataService) { }

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
    const dialogRef = this.dialog.open(AddCandidateDialogComponent, {
      data: {user: Candidate }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 1) {
        this.CandidateDatabase!.dataChange.value.push(this.dataService.getDialogData());
        this.refreshTable();
      }
    });
  }

  startEdit(i: number, id: number, firstname: string, lastname: string,  phoneno: number, email: string, status: string) {
    this.id = id;
    this.index = i;
    console.log(this.index);
    const dialogRef = this.dialog.open(EditCandidateDialogComponent, {
      data: {id: id, firstName: firstname, lastName: lastname, phoneNo: phoneno, email: email,status: status}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 1) {
        const foundIndex = this.CandidateDatabase!.dataChange.value.findIndex(x => x.id === this.id);
        this.CandidateDatabase!.dataChange.value[foundIndex] = this.dataService.getDialogData();
        this.refreshTable();
      }
    });
  }

  deleteItem(i: number, id: number, firstname: string,lastname:string) {
    this.index = i;
    this.id = id;
    const dialogRef = this.dialog.open(DeleteCandidateDialogComponent, {
      data: {id: id, firstName: firstname, lastName:lastname}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 1) {
        const foundIndex = this.CandidateDatabase!.dataChange.value.findIndex(x => x.id === this.id);
        this.CandidateDatabase!.dataChange.value.splice(foundIndex, 1);
        this.refreshTable();
      }
    });
  }


  private refreshTable() {
    this.paginator!._changePageSize(this.paginator!.pageSize);
  }

  public loadData() {
    this.CandidateDatabase = new CandidateDataService(this.httpClient);
    this.dataSource = new CandidateDataSource(this.CandidateDatabase, this.paginator!, this.sort!);
    fromEvent(this.filter!.nativeElement, 'keyup')
      .subscribe(() => {
        if (!this.dataSource) {
          return;
        }
        this.dataSource.filter = this.filter!.nativeElement.value;
      });
  }
}
