import { HttpCommonService } from './../../core/services/httpCommon.service';
import { ChangeDetectorRef, Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { InvoiceDetails } from './models/InvoiceDetails';
import { DataSource } from '@angular/cdk/collections';
import { BehaviorSubject, fromEvent, merge, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { InvoiceDetailsDataSource } from './invoice-details-datasource';
import { InvoiceDetailsDataService } from './services/invoice-details-data.service';
import { AddInvoiceDetailsDialogComponent } from './dialogs/add/add-invoice-details.dialog.component';
import { EditInvoiceDetailsDialogComponent } from './dialogs/edit/edit-invoice-details.dialog.component';
import { NumberFormatStyle } from '@angular/common';
import { DeleteInvoiceDetailsDialogComponent } from './dialogs/delete/delete-invoice_details.dialog.component';
import { InvoiceDialogComponent } from './dialogs/invoice-dialog/invoice-dialog.dialog.component';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { Store } from '@ngrx/store';
import { increment } from 'src/app/core/store/counter.actions';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-invoice-details',
  templateUrl: './invoice-details.component.html',
  styleUrls: ['./invoice-details.component.scss']
})
export class InvoiceDetailsComponent implements OnInit {
  fileName = 'InvoiceDetails';
  displayedColumns = ['invoiceNo', 'createdDate', 'dueDate', 'clientName', 'fromLine1', 'fromLine2', 'fromLine3', 'term', 'status', 'actions'];
  userDatabase?: InvoiceDetailsDataService | null;
  dataSource?: InvoiceDetailsDataSource | null;
  index?: number;
  id?: number;

  constructor(public httpClient: HttpCommonService,
    public dialog: MatDialog,
    public dataService: InvoiceDetailsDataService,
    private ref: ChangeDetectorRef,
    private bottomSheet: MatBottomSheet,
    private store: Store) {
    this.store.dispatch(increment({ message: "Invoice Details" }));
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
    const dialogRef = this.dialog.open(AddInvoiceDetailsDialogComponent, {
      data: { user: InvoiceDetails }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 1) {
        this.loadData();
      }
    });
  }

  startEdit(i: number, id: number, invoiceNo: number, createdDate: Date, dueDate: Date, clientId: number, clientName: string, fromLine1: string, fromLine2: string, fromLine3: string, term: string, status: string, products: any) {
    this.id = id;
    this.index = i;
    const dialogRef = this.dialog.open(EditInvoiceDetailsDialogComponent, {
      data: { id: id, invoiceNo: invoiceNo, createdDate: createdDate, dueDate: dueDate, clientId: clientId, clientName: clientName, fromLine1: fromLine1, fromLine2: fromLine2, fromLine3: fromLine3, term: term, status: status, products: products }
    },);

    dialogRef.afterClosed().subscribe(result => {
      if (result === 1) {
        const foundIndex = this.userDatabase!.dataChange.value.findIndex(x => x.id === this.id);
        this.userDatabase!.dataChange.value[foundIndex] = this.dataService.getDialogData();
        this.refreshTable();
      }
    });
  }

  deleteItem(i: number, id: number, invoiceNo: number) {
    this.index = i;
    this.id = id;
    const dialogRef = this.dialog.open(DeleteInvoiceDetailsDialogComponent, {
      data: { id: id, invoiceNo: invoiceNo }, height: '400px',
      width: '600px',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 1) {
        const foundIndex = this.userDatabase!.dataChange.value.findIndex(x => x.id === this.id);
        this.userDatabase!.dataChange.value.splice(foundIndex, 1);
        this.refreshTable();
      }
    });
  }

  generateInvoice(i: number, id: number) {
    this.index = i;
    this.id = id;
    const dialogRef = this.dialog.open(InvoiceDialogComponent, {
      data: { id: id }
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
    this.userDatabase = new InvoiceDetailsDataService(this.httpClient);
    this.dataSource = new InvoiceDetailsDataSource(this.userDatabase, this.paginator!, this.sort!);
    this.ref.detectChanges();
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
      localStorage.setItem("invoice-details-search", JSON.stringify(this.searchHistory));
    }
    if (!this.dataSource) {
      return;
    }
    this.dataSource.filter = data;
    this.bottomSheet.dismiss();
  }
  public loadSearchHistory() {
    if (localStorage.getItem("invoice-details-search") != null) {
      this.searchHistory = JSON.parse(localStorage.getItem("invoice-details-search")!.toString());
    }
  }
  public onClearSearchHistory() {
    localStorage.removeItem("invoice-details-search")
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

