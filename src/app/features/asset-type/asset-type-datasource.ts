import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { AssetType } from './models/AssetType';
import { DataSource } from '@angular/cdk/collections';
import { BehaviorSubject, merge, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AssetTypeDataService } from './services/asset-type-data.service';

export class AssetTypeDataSource extends DataSource<AssetType> {
  _filterChange = new BehaviorSubject('');

  get filter(): string {
    return this._filterChange.value;
  }

  set filter(filter: string) {
    this._filterChange.next(filter);
  }

  filteredData: AssetType[] = [];
  renderedData: AssetType[] = [];

  constructor(public _exampleDatabase: AssetTypeDataService,
    public _paginator: MatPaginator,
    public _sort: MatSort) {
    super();
    this._filterChange.subscribe(() => this._paginator.pageIndex = 0);
    this._exampleDatabase.getAllAssetType();
  }

  connect(): Observable<AssetType[]> {
    const displayDataChanges = [
      this._exampleDatabase.dataChange,
      this._sort.sortChange,
      this._filterChange,
      this._paginator.page
    ];

    this._exampleDatabase.getAllAssetType();

    return merge(...displayDataChanges).pipe(map(() => {
      this.filteredData = this._exampleDatabase.data.slice().filter((issue: AssetType) => {
        const searchStr = (issue.id + issue.name + issue.description).toLowerCase();
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

  sortData(data: AssetType[]): AssetType[] {
    if (!this._sort.active || this._sort.direction === '') {
      return data;
    }

    return data.sort((a, b) => {
      let propertyA: number | string = '';
      let propertyB: number | string = '';

      switch (this._sort.active) {
        case 'id': [propertyA, propertyB] = [a.id, b.id]; break;
        case 'name': [propertyA, propertyB] = [a.name, b.name]; break;
        case 'description': [propertyA, propertyB] = [a.description, b.description]; break;
        case 'status': [propertyA, propertyB] = [a.status, b.status]; break;
      }

      const valueA = isNaN(+propertyA) ? propertyA : +propertyA;
      const valueB = isNaN(+propertyB) ? propertyB : +propertyB;

      return (valueA < valueB ? -1 : 1) * (this._sort.direction === 'asc' ? 1 : -1);
    });
  }
}
