import { HttpCommonService } from './../../core/services/httpCommon.service';
import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Asset } from './models/Asset';
import { DataSource } from '@angular/cdk/collections';
import { BehaviorSubject, fromEvent, merge, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AssetDataSource } from './asset-datasource';
import { AssetDataService } from './services/asset-data.service';
import { AddAssetDialogComponent } from './dialogs/add/add-asset.dialog.component';
import { EditAssetDialogComponent } from './dialogs/edit/edit-asset.dialog.component';
import { DeleteAssetDialogComponent } from './dialogs/delete/delete-asset.dialog.component';
import { Store } from '@ngrx/store';
import { increment } from 'src/app/core/store/counter.actions';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-asset',
  templateUrl: './asset.component.html',
  styleUrls: ['./asset.component.scss']
})
export class AssetComponent implements OnInit {
  fileName= 'Asset';
  displayedColumns = ['name', 'type', 'modelNumber', 'status', 'actions'];
  userDatabase?: AssetDataService | null;
  dataSource?: AssetDataSource | null;
  index?: number;
  id?: number;

  constructor(public httpClient: HttpCommonService,
    public dialog: MatDialog,
    public dataService: AssetDataService,
    private bottomSheet: MatBottomSheet,
    private store: Store) {
    this.store.dispatch(increment({ message: "Asset" }));
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
    const dialogRef = this.dialog.open(AddAssetDialogComponent, {
      data: { user: Asset }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 1) {
        this.userDatabase!.dataChange.value.push(this.dataService.getDialogData());
        this.refreshTable();
      }
    });
  }

  startEdit(i: number, id: number, name: string, typeId: number, modelNumber: string, status: string) {
    this.id = id;
    this.index = i;
    const dialogRef = this.dialog.open(EditAssetDialogComponent, {
      data: { id: id, name: name, typeId: typeId, modelNumber: modelNumber, status: status }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 1) {
        const foundIndex = this.userDatabase!.dataChange.value.findIndex(x => x.id === this.id);
        this.userDatabase!.dataChange.value[foundIndex] = this.dataService.getDialogData();
        this.refreshTable();
      }
    });
  }

  deleteItem(i: number, id: number, name: string) {
    this.index = i;
    this.id = id;
    const dialogRef = this.dialog.open(DeleteAssetDialogComponent, {
      data: { id: id, name: name }
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
    this.userDatabase = new AssetDataService(this.httpClient);
    this.dataSource = new AssetDataSource(this.userDatabase, this.paginator!, this.sort!);
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
      localStorage.setItem("asset-search", JSON.stringify(this.searchHistory));
    }
    if (!this.dataSource) {
      return;
    }
    this.dataSource.filter = data;
    this.bottomSheet.dismiss();
  }
  public loadSearchHistory() {
    if (localStorage.getItem("asset-search") != null) {
      this.searchHistory = JSON.parse(localStorage.getItem("asset-search")!.toString());
    }
  }
  public onClearSearchHistory() {
    localStorage.removeItem("asset-search")
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

