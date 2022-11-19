import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {InvoiceDetails} from './models/InvoiceDetails';
import {DataSource} from '@angular/cdk/collections';
import {BehaviorSubject, merge, Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {InvoiceDetailsDataService} from './services/invoice-details-data.service';

export class InvoiceDetailsDataSource extends DataSource<InvoiceDetails> {
  _filterChange = new BehaviorSubject('');

  get filter(): string {
    return this._filterChange.value;
  }

  set filter(filter: string) {
    this._filterChange.next(filter);
  }

  filteredData: InvoiceDetails[] = [];
  renderedData: InvoiceDetails[] = [];

  constructor(public _exampleDatabase: InvoiceDetailsDataService,
              public _paginator: MatPaginator,
              public _sort: MatSort) {
    super();
    // Reset to the first page when the user changes the filter.
    this._filterChange.subscribe(() => this._paginator.pageIndex = 0);
    this._exampleDatabase.getAllInvoiceDetails();
  }

  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<InvoiceDetails[]> {
    // Listen for any changes in the base data, sorting, filtering, or pagination
    const displayDataChanges = [
      this._exampleDatabase.dataChange,
      this._sort.sortChange,
      this._filterChange,
      this._paginator.page
    ];

    this._exampleDatabase.getAllInvoiceDetails();


    return merge(...displayDataChanges).pipe(map( () => {
        // Filter data
        this.filteredData = this._exampleDatabase.data.slice().filter((issue: InvoiceDetails) => {
          const searchStr = (issue.id + issue.invoiceNo + issue.clientName).toLowerCase();
          return searchStr.indexOf(this.filter.toLowerCase()) !== -1;
        });

        // Sort filtered data
        const sortedData = this.sortData(this.filteredData.slice());

        // Grab the page's slice of the filtered sorted data.
        const startIndex = this._paginator.pageIndex * this._paginator.pageSize;
        this.renderedData = sortedData.splice(startIndex, this._paginator.pageSize);
        return this.renderedData;
      }
    ));
  }

  disconnect() {}


  /** Returns a sorted copy of the database data. */
  sortData(data: InvoiceDetails[]): InvoiceDetails[] {
    if (!this._sort.active || this._sort.direction === '') {
      return data;
    }

    return data.sort((a, b) => {
      let propertyA: number | string = '';
      let propertyB: number | string = '';

      switch (this._sort.active) {
        case 'id': [propertyA, propertyB] = [a.id, b.id]; break;
        case 'invoiceNo': [propertyA, propertyB] = [a.invoiceNo, b.invoiceNo]; break;
        case 'clientId': [propertyA, propertyB] = [a.clientId, b.clientId]; break;
        case 'clientName': [propertyA, propertyB] = [a.clientName, b.clientName]; break;
        case 'fromLine1': [propertyA, propertyB] = [a.fromLine1, b.fromLine1]; break;
        case 'fromLine2': [propertyA, propertyB] = [a.fromLine2, b.fromLine2]; break;
        case 'fromLine3': [propertyA, propertyB] = [a.fromLine3, b.fromLine3]; break;
        case 'term': [propertyA, propertyB] = [a.term, b.term]; break;
        case 'status': [propertyA, propertyB] = [a.status, b.status]; break;
        // case 'firstName': [propertyA, propertyB] = [a.firstName, b.firstName]; break;
        // case 'lastName': [propertyA, propertyB] = [a.lastName, b.lastName]; break;
        // case 'email': [propertyA, propertyB] = [a.email, b.email]; break;
        // case 'phoneNumber': [propertyA, propertyB] = [a.phoneNumber, b.phoneNumber]; break;
        // case 'employeeType': [propertyA, propertyB] = [a.employeeType, b.employeeType]; break;
        // case 'status': [propertyA, propertyB] = [a.status, b.status]; break;
      }

      const valueA = isNaN(+propertyA) ? propertyA : +propertyA;
      const valueB = isNaN(+propertyB) ? propertyB : +propertyB;

      return (valueA < valueB ? -1 : 1) * (this._sort.direction === 'asc' ? 1 : -1);
    });
  }
}


// import {MatPaginator} from '@angular/material/paginator';
// import {MatSort} from '@angular/material/sort';
// import { InvoiceDetails} from './models/InvoiceDetails';
// import {DataSource} from '@angular/cdk/collections';
// import {BehaviorSubject, merge, Observable} from 'rxjs';
// import {map} from 'rxjs/operators';
// import { InvoiceDetailsDataService } from './services/invoice-details-data.service';

// export class InvoiceDetailsDataSource extends DataSource<InvoiceDetails> {
//   _filterChange = new BehaviorSubject('');

//   get filter(): string {
//     return this._filterChange.value;
//   }

//   set filter(filter: string) {
//     this._filterChange.next(filter);
//   }

//   filteredData:InvoiceDetails[] = [];
//   renderedData: InvoiceDetails[] = [];

//   constructor(public _exampleDatabase: InvoiceDetailsDataService,
//               public _paginator: MatPaginator,
//               public _sort: MatSort) {
//     super();
//     // Reset to the first page when the user changes the filter.
//     this._filterChange.subscribe(() => this._paginator.pageIndex = 0);
//     this._exampleDatabase.getAllInvoiceDetails();
//   }

//   /** Connect function called by the table to retrieve one stream containing the data to render. */
//   connect(): Observable<InvoiceDetails[]> {
//     // Listen for any changes in the base data, sorting, filtering, or pagination
//     const displayDataChanges = [
//       this._exampleDatabase.dataChange,
//       this._sort.sortChange,
//       this._filterChange,
//       this._paginator.page
//     ];

//     this._exampleDatabase.getAllInvoiceDetails();


//     return merge(...displayDataChanges).pipe(map( () => {
//         // Filter data
//         this.filteredData = this._exampleDatabase.data.slice().filter((issue: InvoiceDetails) => {
//           const searchStr = (issue.id + issue.invoiceNo + issue.clientName);
//         //   return searchStr.indexOf(this.filter.toLowerCase()) !== -1;
//         });

//         // Sort filtered data
//         const sortedData = this.sortData(this.filteredData.slice());

//         // Grab the page's slice of the filtered sorted data.
//         const startIndex = this._paginator.pageIndex * this._paginator.pageSize;
//         this.renderedData = sortedData.splice(startIndex, this._paginator.pageSize);
//         return this.renderedData;
//       }
//     ));
//   }

//   disconnect() {}


//   /** Returns a sorted copy of the database data. */
//   sortData(data: InvoiceDetails[]): InvoiceDetails[] {
//     if (!this._sort.active || this._sort.direction === '') {
//       return data;
//     }

//     return data.sort((a, b) => {
//       let propertyA: number | string = '';
//       let propertyB: number | string = '';

//       switch (this._sort.active) {
//         case 'id': [propertyA, propertyB] = [a.id, b.id]; break;
//         case 'invoiceNo': [propertyA, propertyB] = [a.invoiceNo, b.invoiceNo]; break;
//         case 'clientId': [propertyA, propertyB] = [a.clientId, b.clientId]; break;
//         case 'clientName': [propertyA, propertyB] = [a.clientName, b.clientName]; break;
//         case 'fromLine1': [propertyA, propertyB] = [a.fromLine1, b.fromLine1]; break;
//         case 'fromLine2': [propertyA, propertyB] = [a.fromLine2, b.fromLine2]; break;
//         case 'fromLine3': [propertyA, propertyB] = [a.fromLine3, b.fromLine3]; break;
//         case 'term': [propertyA, propertyB] = [a.term, b.term]; break;
//         case 'status': [propertyA, propertyB] = [a.status, b.status]; break;
//       }

//       const valueA = isNaN(+propertyA) ? propertyA : +propertyA;
//       const valueB = isNaN(+propertyB) ? propertyB : +propertyB;

//       return (valueA < valueB ? -1 : 1) * (this._sort.direction === 'asc' ? 1 : -1);
//     });
//   }
// }
