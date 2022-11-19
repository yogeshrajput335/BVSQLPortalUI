import { HttpCommonService } from './../../core/services/httpCommon.service';
import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {MatDialog} from '@angular/material/dialog';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {AssetType} from './models/AssetType';
import {DataSource} from '@angular/cdk/collections';
import {BehaviorSubject, fromEvent, merge, Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import { AssetTypeDataSource } from './asset-type-datasource';
import { AssetTypeDataService } from './services/asset-type-data.service';
import { AddAssetTypeDialogComponent } from './dialogs/add/add-asset-type.dialog.component';
import { EditAssetTypeDialogComponent } from './dialogs/edit/edit-asset-type.dialog.component';
import { DeleteAssetTypeDialogComponent } from './dialogs/delete/delete-asset-type.dialog.component';


@Component({
  selector: 'app-asset-type',
  templateUrl: './asset-type.component.html',
  styleUrls: ['./asset-type.component.scss']
})
export class AssetTypeComponent implements OnInit {
  displayedColumns = ['name', 'description', 'status', 'actions'];
  userDatabase?: AssetTypeDataService | null;
  dataSource?: AssetTypeDataSource | null;
  index?: number;
  id?: number;

  constructor(public httpClient: HttpCommonService,
              public dialog: MatDialog,
              public dataService: AssetTypeDataService) {}

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
    const dialogRef = this.dialog.open(AddAssetTypeDialogComponent, {
      data: {user: AssetType }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 1) {
        // After dialog is closed we're doing frontend updates
        // For add we're just pushing a new row inside UserDataService
        this.userDatabase!.dataChange.value.push(this.dataService.getDialogData());
        this.refreshTable();
      }
    });
  }

  startEdit(i: number, id: number, name: string, description: string, status: string) {
    this.id = id;
    // index row is used just for debugging proposes and can be removed
    this.index = i;
    const dialogRef = this.dialog.open(EditAssetTypeDialogComponent, {
      data: {id: id, name: name, description: description, status: status}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 1) {
        // When using an edit things are little different, firstly we find record inside UserDataService by id
        const foundIndex = this.userDatabase!.dataChange.value.findIndex(x => x.id === this.id);
        // Then you update that record using data from dialogData (values you enetered)
        this.userDatabase!.dataChange.value[foundIndex] = this.dataService.getDialogData();
        // And lastly refresh table
        this.refreshTable();
      }
    });
  }

  deleteItem(i: number, id: number, name: string) {
    this.index = i;
    this.id = id;
    const dialogRef = this.dialog.open(DeleteAssetTypeDialogComponent, {
      data: {id: id, name: name}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 1) {
        const foundIndex = this.userDatabase!.dataChange.value.findIndex(x => x.id === this.id);
        // for delete we use splice in order to remove single object from UserDataService
        this.userDatabase!.dataChange.value.splice(foundIndex, 1);
        this.refreshTable();
      }
    });
  }


  private refreshTable() {
    // Refreshing table using paginator
    // Thanks yeager-j for tips
    // https://github.com/marinantonio/angular-mat-table-crud/issues/12
    this.paginator!._changePageSize(this.paginator!.pageSize);
  }


  public loadData() {
    this.userDatabase = new AssetTypeDataService(this.httpClient);
    this.dataSource = new AssetTypeDataSource(this.userDatabase, this.paginator!, this.sort!);
    fromEvent(this.filter!.nativeElement, 'keyup')
      // .debounceTime(150)
      // .distinctUntilChanged()
      .subscribe(() => {
        if (!this.dataSource) {
          return;
        }
        this.dataSource.filter = this.filter!.nativeElement.value;
      });
  }
}

