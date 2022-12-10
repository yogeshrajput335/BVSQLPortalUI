import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {DataSource} from '@angular/cdk/collections';
import {BehaviorSubject, merge, Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import { ProjectAssignment} from './models/ProjectAssignment';
import { ProjectAssignmentDataService } from './services/project-assignment-data.service';

export class ProjectAssignmentDataSource extends DataSource<ProjectAssignment> {
  _filterChange = new BehaviorSubject('');

  get filter(): string {
    return this._filterChange.value;
  }

  set filter(filter: string) {
    this._filterChange.next(filter);
  }

  filteredData: ProjectAssignment[] = [];
  renderedData: ProjectAssignment[] = [];

  constructor(public _exampleDatabase: ProjectAssignmentDataService,
              public _paginator: MatPaginator,
              public _sort: MatSort) {
    super();
    this._filterChange.subscribe(() => this._paginator.pageIndex = 0);
    this._exampleDatabase.getAllProjectAssignments();
  }

  connect(): Observable<ProjectAssignment[]> {
    const displayDataChanges = [
      this._exampleDatabase.dataChange,
      this._sort.sortChange,
      this._filterChange,
      this._paginator.page
    ];

    this._exampleDatabase.getAllProjectAssignments();

    return merge(...displayDataChanges).pipe(map( () => {
        this.filteredData = this._exampleDatabase.data.slice().filter((issue: ProjectAssignment) => {
          const searchStr = (issue.id + issue.projectName).toLowerCase();
          return searchStr.indexOf(this.filter.toLowerCase()) !== -1;
        });

        const sortedData = this.sortData(this.filteredData.slice());

        const startIndex = this._paginator.pageIndex * this._paginator.pageSize;
        this.renderedData = sortedData.splice(startIndex, this._paginator.pageSize);
        return this.renderedData;
      }
    ));
  }

  disconnect() {}

  sortData(data: ProjectAssignment[]): ProjectAssignment[] {
    if (!this._sort.active || this._sort.direction === '') {
      return data;
    }

    return data.sort((a, b) => {
      let propertyA: number | string = '';
      let propertyB: number | string = '';

      switch (this._sort.active) {
        case 'id': [propertyA, propertyB] = [a.id, b.id]; break;
        case 'projectName': [propertyA, propertyB] = [a.projectName, b.projectName]; break;
        case 'employeeId': [propertyA, propertyB] = [a.employeeId, b.employeeId]; break;
        case 'notes': [propertyA, propertyB] = [a.notes, b.notes]; break;
    }

      const valueA = isNaN(+propertyA) ? propertyA : +propertyA;
      const valueB = isNaN(+propertyB) ? propertyB : +propertyB;

      return (valueA < valueB ? -1 : 1) * (this._sort.direction === 'asc' ? 1 : -1);
    });
  }
}
