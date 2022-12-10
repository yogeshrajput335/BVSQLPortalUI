import { Reference } from './models/Reference';
import { HttpCommonService } from './../../core/services/httpCommon.service';
import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ReferenceDataService } from './services/reference-data.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { DataSource } from '@angular/cdk/collections';
import { AddReferenceDialogComponent } from './dialogs/add/add-reference.dialog.component';
import { EditReferenceDialogComponent } from './dialogs/edit/edit-reference.dialog.component';
import { DeleteReferenceDialogComponent } from './dialogs/delete/delete-reference.dialog.component';
import { BehaviorSubject, fromEvent, merge, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ReferenceDataSource } from './reference-datasource';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { Store } from '@ngrx/store';
import { increment } from 'src/app/core/store/counter.actions';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-reference',
  templateUrl: './reference.component.html',
  styleUrls: ['./reference.component.scss']
})
export class ReferenceComponent implements OnInit {
  fileName= 'Reference';
  displayedColumns = ['firstName', 'lastName', 'phoneNo', 'email', 'status', 'actions'];
  ReferenceDatabase?: ReferenceDataService | null;
  dataSource?: ReferenceDataSource | null;
  index?: number;
  id?: number;

  constructor(public httpClient: HttpCommonService,
    public dialog: MatDialog,
    public dataService: ReferenceDataService,
    private authService: AuthenticationService,
    private bottomSheet: MatBottomSheet,
    private store: Store) {
    this.store.dispatch(increment({ message: "Reference" }));
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
    const dialogRef = this.dialog.open(AddReferenceDialogComponent, {
      data: { user: Reference }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 1) {
        this.ReferenceDatabase!.dataChange.value.push(this.dataService.getDialogData());
        this.refreshTable();
      }
    });
  }

  startEdit(i: number, id: number, firstname: string, lastname: string, phoneno: number, email: string, status: string) {
    this.id = id;
    this.index = i;
    const dialogRef = this.dialog.open(EditReferenceDialogComponent, {
      data: { id: id, firstName: firstname, lastName: lastname, phoneNo: phoneno, email: email, status: status }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 1) {
        const foundIndex = this.ReferenceDatabase!.dataChange.value.findIndex(x => x.id === this.id);
        this.ReferenceDatabase!.dataChange.value[foundIndex] = this.dataService.getDialogData();
        this.refreshTable();
      }
    });
  }

  deleteItem(i: number, id: number, firstname: string, lastname: string) {
    this.index = i;
    this.id = id;
    const dialogRef = this.dialog.open(DeleteReferenceDialogComponent, {
      data: { id: id, firstName: firstname, lastName: lastname }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 1) {
        const foundIndex = this.ReferenceDatabase!.dataChange.value.findIndex(x => x.id === this.id);
        this.ReferenceDatabase!.dataChange.value.splice(foundIndex, 1);
        this.refreshTable();
      }
    });
  }

  moveToCandidate(i: number, id: number) {
    this.dataService.moveToCandidate(id, (this.authService.getUser() as any).employeeId).subscribe((data: any) => {
      this.loadData();
    },
      (error: HttpErrorResponse) => {
        console.log(error.name + ' ' + error.message);
      });;
  }


  private refreshTable() {
    this.paginator!._changePageSize(this.paginator!.pageSize);
  }

  public loadData() {
    this.ReferenceDatabase = new ReferenceDataService(this.httpClient);
    this.dataSource = new ReferenceDataSource(this.ReferenceDatabase, this.paginator!, this.sort!);
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
      localStorage.setItem("reference-search", JSON.stringify(this.searchHistory));
    }
    if (!this.dataSource) {
      return;
    }
    this.dataSource.filter = data;
    this.bottomSheet.dismiss();
  }
  public loadSearchHistory() {
    if (localStorage.getItem("reference-search") != null) {
      this.searchHistory = JSON.parse(localStorage.getItem("reference-search")!.toString());
    }
  }
  public onClearSearchHistory() {
    localStorage.removeItem("reference-search")
    this.searchHistory = []
  }

  exportexcel(): void
  {
    if(this.ReferenceDatabase && this.ReferenceDatabase.data){
    const ws: XLSX.WorkSheet =XLSX.utils.json_to_sheet(this.ReferenceDatabase.data);
    
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, this.fileName + 'Data');
    
    XLSX.writeFile(wb, this.fileName+(new Date()).toUTCString()+".xlsx");
    } else {
      alert('Error on export to excel.')
    }
}
}
