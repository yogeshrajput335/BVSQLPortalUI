import { HttpCommonService } from './../../core/services/httpCommon.service';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
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


@Component({
  selector: 'app-asset',
  templateUrl: './asset.component.html',
  styleUrls: ['./asset.component.scss']
})
export class AssetComponent implements OnInit {
  displayedColumns = ['name', 'type', 'modelNumber', 'status', 'actions'];
  userDatabase?: AssetDataService | null;
  dataSource?: AssetDataSource | null;
  index?: number;
  id?: number;

  constructor(public httpClient: HttpCommonService,
    public dialog: MatDialog,
    public dataService: AssetDataService) { }

  @ViewChild(MatPaginator, { static: true }) paginator?: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort?: MatSort;
  @ViewChild('filter', { static: true }) filter?: ElementRef;

  ngOnInit() {
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
}

