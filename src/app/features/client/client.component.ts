import { Client } from './models/Client';
import { HttpCommonService } from './../../core/services/httpCommon.service';
import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ClientDataService } from './services/client-data.service';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { DataSource } from '@angular/cdk/collections';
import { AddClientDialogComponent } from './dialogs/add/add-client.dialog.component';
import { EditClientDialogComponent } from './dialogs/edit/edit-client.dialog.component';
import { DeleteClientDialogComponent } from './dialogs/delete/delete-client.dialog.component';
import { BehaviorSubject, fromEvent, merge, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ClientDataSource } from './client-datasource';
import { SetTermClientDialogComponent } from './dialogs/set-term/set-term.dialog.component';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { Store } from '@ngrx/store';
import { increment } from 'src/app/core/store/counter.actions';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.scss']
})
export class ClientComponent implements OnInit {
  fileName = 'Client';
  displayedColumns = ['clientName', 'termText', 'contactPerson', 'email', 'phoneNumber', 'address', 'status', 'actions'];
  ClientDatabase?: ClientDataService | null;
  dataSource?: ClientDataSource | null;
  index?: number;
  id?: number;

  constructor(public httpClient: HttpCommonService,
    public dialog: MatDialog,
    public dataService: ClientDataService,
    private bottomSheet: MatBottomSheet,
    private store: Store) {
    this.store.dispatch(increment({ message: "Client" }));
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
    const dialogRef = this.dialog.open(AddClientDialogComponent, {
      data: { user: Client }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 1) {
        this.ClientDatabase!.dataChange.value.push(this.dataService.getDialogData());
        this.refreshTable();
      }
    });
  }

  startEdit(i: number, id: number, clientname: string, contactperson: string, email: string, phonenumber: number, address: string, status: string) {
    this.id = id;
    this.index = i;
    const dialogRef = this.dialog.open(EditClientDialogComponent, {
      data: { id: id, clientName: clientname, contactPerson: contactperson, email: email, phoneNumber: phonenumber, address: address, status: status }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 1) {
        const foundIndex = this.ClientDatabase!.dataChange.value.findIndex(x => x.id === this.id);
        this.ClientDatabase!.dataChange.value[foundIndex] = this.dataService.getDialogData();
        this.refreshTable();
      }
    });
  }

  deleteItem(i: number, id: number, clientname: string) {
    this.index = i;
    this.id = id;
    const dialogRef = this.dialog.open(DeleteClientDialogComponent, {
      data: { id: id, clientname: clientname }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 1) {
        const foundIndex = this.ClientDatabase!.dataChange.value.findIndex(x => x.id === this.id);
        this.ClientDatabase!.dataChange.value.splice(foundIndex, 1);
        this.refreshTable();
      }
    });
  }
  setTerm(i: number, id: number, clientName: string, term: number) {
    this.index = i;
    this.id = id;
    const dialogRef = this.dialog.open(SetTermClientDialogComponent, {
      data: { id: id, clientName: clientName, term: term }
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
    this.ClientDatabase = new ClientDataService(this.httpClient);
    this.dataSource = new ClientDataSource(this.ClientDatabase, this.paginator!, this.sort!);
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
      localStorage.setItem("client-search", JSON.stringify(this.searchHistory));
    }
    if (!this.dataSource) {
      return;
    }
    this.dataSource.filter = data;
    this.bottomSheet.dismiss();
  }
  public loadSearchHistory() {
    if (localStorage.getItem("client-search") != null) {
      this.searchHistory = JSON.parse(localStorage.getItem("client-search")!.toString());
    }
  }
  public onClearSearchHistory() {
    localStorage.removeItem("client-search")
    this.searchHistory = []
  }

  exportexcel(): void {
    if (this.ClientDatabase && this.ClientDatabase.data) {
      const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.ClientDatabase.data);

      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, this.fileName + 'Data');

      XLSX.writeFile(wb, this.fileName + (new Date()).toUTCString() + ".xlsx");
    } else {
      alert('Error on export to excel.')
    }
  }
}
