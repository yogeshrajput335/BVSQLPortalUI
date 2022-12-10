import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { AssetAllocation } from './models/AssetAllocation';
import { DataSource } from '@angular/cdk/collections';
import { BehaviorSubject, merge, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AssetAllocationDataService } from './services/asset-allocation-data.service';

export class AssetAllocationDataSource extends DataSource<AssetAllocation> {
  _filterChange = new BehaviorSubject('');

  get filter(): string {
    return this._filterChange.value;
  }

  set filter(filter: string) {
    this._filterChange.next(filter);
  }

  filteredData: AssetAllocation[] = [];
  renderedData: AssetAllocation[] = [];

  constructor(public _exampleDatabase: AssetAllocationDataService,
    public _paginator: MatPaginator,
    public _sort: MatSort) {
    super();
    this._filterChange.subscribe(() => this._paginator.pageIndex = 0);
    this._exampleDatabase.getAllAssetAllocation();
  }


  connect(): Observable<AssetAllocation[]> {
    const displayDataChanges = [
      this._exampleDatabase.dataChange,
      this._sort.sortChange,
      this._filterChange,
      this._paginator.page
    ];

    this._exampleDatabase.getAllAssetAllocation();


    return merge(...displayDataChanges).pipe(map(() => {
      this.filteredData = this._exampleDatabase.data.slice().filter((issue: AssetAllocation) => {
        const searchStr = (issue.id + issue.assetName + issue.allocatedBy + issue.allocatedTo).toLowerCase();
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

  sortData(data: AssetAllocation[]): AssetAllocation[] {
    if (!this._sort.active || this._sort.direction === '') {
      return data;
    }

    return data.sort((a, b) => {
      let propertyA: number | string = '';
      let propertyB: number | string = '';

      switch (this._sort.active) {
        case 'id': [propertyA, propertyB] = [a.id, b.id]; break;
        case 'assetName': [propertyA, propertyB] = [a.assetName, b.assetName]; break;
        case 'assetId': [propertyA, propertyB] = [a.assetId, b.assetId]; break;
        case 'allocatedBy': [propertyA, propertyB] = [a.allocatedBy, b.allocatedBy]; break;
        case 'allocatedById': [propertyA, propertyB] = [a.allocatedById, b.allocatedById]; break;
        case 'allocatedTo': [propertyA, propertyB] = [a.allocatedTo, b.allocatedTo]; break;
        case 'allocatedToId': [propertyA, propertyB] = [a.allocatedToId, b.allocatedToId]; break;
        case 'status': [propertyA, propertyB] = [a.status, b.status]; break;
      }

      const valueA = isNaN(+propertyA) ? propertyA : +propertyA;
      const valueB = isNaN(+propertyB) ? propertyB : +propertyB;

      return (valueA < valueB ? -1 : 1) * (this._sort.direction === 'asc' ? 1 : -1);
    });
  }
}
