import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { DataSource } from '@angular/cdk/collections';
import { BehaviorSubject, merge, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Client } from './models/Client';
import { ClientDataService } from './services/client-data.service';

export class ClientDataSource extends DataSource<Client> {
  _filterChange = new BehaviorSubject('');

  get filter(): string {
    return this._filterChange.value;
  }

  set filter(filter: string) {
    this._filterChange.next(filter);
  }

  filteredData: Client[] = [];
  renderedData: Client[] = [];

  constructor(public _exampleDatabase: ClientDataService,
    public _paginator: MatPaginator,
    public _sort: MatSort) {
    super();

    this._filterChange.subscribe(() => this._paginator.pageIndex = 0);
    this._exampleDatabase.getAllClient();
  }

  connect(): Observable<Client[]> {
    const displayDataChanges = [
      this._exampleDatabase.dataChange,
      this._sort.sortChange,
      this._filterChange,
      this._paginator.page
    ];

    this._exampleDatabase.getAllClient();


    return merge(...displayDataChanges).pipe(map(() => {
      this.filteredData = this._exampleDatabase.data.slice().filter((issue: Client) => {
        const searchStr = (issue.id + issue.clientName + issue.contactPerson + issue.email + issue.phoneNumber + issue.address + issue.status).toLowerCase();
        return searchStr.indexOf(this.filter.toLowerCase()) !== -1;
      });

      const sortedData = this.sortData(this.filteredData.slice());

      const startIndex = this._paginator.pageIndex * this._paginator.pageSize;
      this.renderedData = sortedData.splice(startIndex, this._paginator.pageSize);
      return this.renderedData;
    }
    ));
  }

  disconnect() { }

  sortData(data: Client[]): Client[] {
    if (!this._sort.active || this._sort.direction === '') {
      return data;
    }

    return data.sort((a, b) => {
      let propertyA: number | string = '';
      let propertyB: number | string = '';

      switch (this._sort.active) {
        case 'id': [propertyA, propertyB] = [a.id, b.id]; break;
        case 'clientname': [propertyA, propertyB] = [a.clientName, b.clientName]; break;
        case 'contactperson': [propertyA, propertyB] = [a.contactPerson, b.contactPerson]; break;
        case 'email': [propertyA, propertyB] = [a.email, b.email]; break;
        case 'phonenumber': [propertyA, propertyB] = [a.phoneNumber, b.phoneNumber]; break;
        case 'address': [propertyA, propertyB] = [a.address, b.address]; break;
        case 'status': [propertyA, propertyB] = [a.status, b.status]; break;
      }

      const valueA = isNaN(+propertyA) ? propertyA : +propertyA;
      const valueB = isNaN(+propertyB) ? propertyB : +propertyB;

      return (valueA < valueB ? -1 : 1) * (this._sort.direction === 'asc' ? 1 : -1);
    });
  }
}
