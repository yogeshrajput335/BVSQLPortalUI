 import {Injectable} from '@angular/core';
 import {BehaviorSubject} from 'rxjs';
 import {HttpClient, HttpErrorResponse} from '@angular/common/http';
 import { HttpCommonService } from 'src/app/core/services/httpCommon.service';
 import { Jobs } from './Jobs';

 @Injectable()
 export class JobsDataService {
  jobs:any[] =[]

  dataChange: BehaviorSubject<Jobs[]> = new BehaviorSubject<Jobs[]>([]);

  dialogData: any;

 constructor (private httpClient: HttpCommonService) {
       this.httpClient.get('Openjobs/GetOpenjobs').subscribe((data:any) => {
       this.jobs = data;
    },
         (error: HttpErrorResponse) => {
     console.log (error.name + ' ' + error.message);
     });
   }

  get data(): Jobs[] {
      return this.dataChange.value;
   }

   getDialogData() {
     return this.dialogData;
   }

  /** CRUD METHODS */
      getAllJobs(): void {
     this.httpClient.get('Openjobs/GetOpenjobs').subscribe((data:any) => {
         this.dataChange.next(data);
       },
       (error: HttpErrorResponse) => {
      console.log (error.name + ' ' + error.message);
       });
   }

//   // DEMO ONLY, you can find working methods below
  addJobs (jobs: Jobs): void {
     this.dialogData = jobs;
     this.httpClient.post('Openjobs/InsertOpenjobs',jobs).subscribe((data:any) => {
       //this.dataChange.next(data);
     },
     (error: HttpErrorResponse) => {
    console.log (error.name + ' ' + error.message);
     });
   }
 }