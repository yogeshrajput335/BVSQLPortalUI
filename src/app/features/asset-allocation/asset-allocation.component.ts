import { AssetAllocation } from './models/AssetAllocation';
import { HttpCommonService } from './../../core/services/httpCommon.service';
import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { DataSource } from '@angular/cdk/collections';
import { BehaviorSubject, fromEvent, merge, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AssetAllocationDataService } from './services/asset-allocation-data.service';
import { AssetAllocationDataSource } from './asset-allocation-datasource';
import { EditAssetAllocationDialogComponent } from './dialogs/edit/edit-asset-allocation.dialog.component';
import { DeleteAssetAllocationDialogComponent } from './dialogs/delete/delete-asset-allocation.dialog.component';
import { AddAssetAllocationDialogComponent } from './dialogs/add/add-asset-allocation.dialog.component';
import { Store } from '@ngrx/store';
import { increment } from 'src/app/core/store/counter.actions';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-asset-allocation',
  templateUrl: './asset-allocation.component.html',
  styleUrls: ['./asset-allocation.component.scss']
})
export class AssetAllocationComponent implements OnInit {
  fileName = 'AssetAllocation';
  displayedColumns = ['assetName', 'allocatedTo', 'allocatedBy', 'allocatedDate', 'returnDate', 'status', 'actions'];
  userDatabase?: AssetAllocationDataService | null;
  dataSource?: AssetAllocationDataSource | null;
  index?: number;
  id?: number;

  constructor(public httpClient: HttpCommonService,
    public dialog: MatDialog,
    public dataService: AssetAllocationDataService,
    private bottomSheet: MatBottomSheet,
    private store: Store) {
    this.store.dispatch(increment({ message: "Asset Allocation" }));
  }

  @ViewChild(MatPaginator, { static: true }) paginator?: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort?: MatSort;
  @ViewChild('filter', { static: true }) filter?: ElementRef;
  @ViewChild('templateBottomSheet') TemplateBottomSheet: TemplateRef<any> | undefined;

  ngOnInit() {
    this.loadSearchHistory();
    this.loadData();
  }

  refresh() {
    this.loadData();
  }

  addNew() {
    const dialogRef = this.dialog.open(AddAssetAllocationDialogComponent, {
      data: { user: AssetAllocation }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 1) {
        this.userDatabase!.dataChange.value.push(this.dataService.getDialogData());
        this.refreshTable();
      }
    });
  }

  startEdit(i: number, id: number, assetId: number, allocatedById: number, allocatedToId: number, allocatedDate: Date, returnDate: Date, status: string) {
    this.id = id;
    this.index = i;
    const dialogRef = this.dialog.open(EditAssetAllocationDialogComponent, {
      data: { id: id, assetId: assetId, allocatedById: allocatedById, allocatedToId: allocatedToId, allocatedDate: allocatedDate, returnDate: returnDate, status: status }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 1) {
        const foundIndex = this.userDatabase!.dataChange.value.findIndex(x => x.id === this.id);
        this.userDatabase!.dataChange.value[foundIndex] = this.dataService.getDialogData();
        this.refreshTable();
      }
    });
  }

  deleteItem(i: number, id: number, assetName: string, allocatedTo: string) {
    this.index = i;
    this.id = id;
    const dialogRef = this.dialog.open(DeleteAssetAllocationDialogComponent, {
      data: { id: id, assetName: assetName, allocatedTo: allocatedTo }
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
    this.userDatabase = new AssetAllocationDataService(this.httpClient);
    this.dataSource = new AssetAllocationDataSource(this.userDatabase, this.paginator!, this.sort!);
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
      localStorage.setItem("asset-allocation-search", JSON.stringify(this.searchHistory));
    }
    if (!this.dataSource) {
      return;
    }
    this.dataSource.filter = data;
    this.bottomSheet.dismiss();
  }
  public loadSearchHistory() {
    if (localStorage.getItem("asset-allocation-search") != null) {
      this.searchHistory = JSON.parse(localStorage.getItem("asset-allocation-search")!.toString());
    }
  }
  public onClearSearchHistory() {
    localStorage.removeItem("asset-allocation-search")
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

