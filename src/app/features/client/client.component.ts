import { Client } from './models/Client';
import { HttpCommonService } from './../../core/services/httpCommon.service';
import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ClientDataService} from './services/client-data.service';
import {HttpClient} from '@angular/common/http';
import {MatDialog} from '@angular/material/dialog';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {DataSource} from '@angular/cdk/collections';
import {AddClientDialogComponent} from './dialogs/add/add-client.dialog.component';
import {EditClientDialogComponent} from './dialogs/edit/edit-client.dialog.component';
import {DeleteClientDialogComponent} from './dialogs/delete/delete-client.dialog.component';
import {BehaviorSubject, fromEvent, merge, Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import { ClientDataSource } from './client-datasource';

@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.scss']
})
export class ClientComponent implements OnInit {
  displayedColumns = ['clientName', 'contactPerson', 'email','phoneNumber','address', 'status', 'actions'];
  ClientDatabase?: ClientDataService | null;
  dataSource?: ClientDataSource | null;
  index?: number;
  id?: number;

  constructor(public httpClient: HttpCommonService,
              public dialog: MatDialog,
              public dataService: ClientDataService) {}

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
    const dialogRef = this.dialog.open(AddClientDialogComponent, {
      data: {user: Client }
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
    console.log(this.index);
    const dialogRef = this.dialog.open(EditClientDialogComponent, {
      data: {id: id, clientName: clientname, contactPerson: contactperson, email: email, phoneNumber: phonenumber, address: address,status: status}
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
      data: {id: id, clientname: clientname}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 1) {
        const foundIndex = this.ClientDatabase!.dataChange.value.findIndex(x => x.id === this.id);
        this.ClientDatabase!.dataChange.value.splice(foundIndex, 1);
        this.refreshTable();
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
}