import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { HttpCommonService } from 'src/app/core/services/httpCommon.service';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { JobsDialogComponent } from '../jobs/jobs-dialog/jobs-dialog.component';
import { JobsDataService } from './jobs-data.service';


@Component({

  selector: 'app-jobs',

  templateUrl: './jobs.component.html',

  styleUrls: ['./jobs.component.scss']

})

export class JobsComponent implements OnInit {
    jobsDatabase?: JobsDataService | null;
    jobs:any[] = [];
    isDeletedJobsShow = false;

    constructor(public httpClient: HttpCommonService ,
              public dialog: MatDialog,
              public dataService: JobsDataService ) { }

              ngOnInit() {
                this.getAllJobs();
              }

              addJobs(): void {
                const dialogRef = this.dialog.open(JobsDialogComponent, {

                });

                dialogRef.afterClosed().subscribe(result => {
                  this.getAllJobs();
                   // this.jobsDatabase!.dataChange.value.push(this.dataService.getDialogData());
                //   console.log('The dialog was closed');
                  });
              }



  getAllJobs(): void {
    this.httpClient.get('Openjobs/GetOpenjobs').subscribe((data:any) => {
      this.jobs = data;
      this.isDeletedJobsShow = false;
      },
      (error: HttpErrorResponse) => {
      console.log (error.name + ' ' + error.message);
      });

  }
  onDelete(id:any){
    this.httpClient.put('Openjobs/UpdateStatusInactiveOpenjobs/'+id,null).subscribe((data:any) => {
      this.getAllJobs();
      },
      (error: HttpErrorResponse) => {
      console.log (error.name + ' ' + error.message);
      });
  }
  onSetActiveJob(id:any){
    this.httpClient.put('Openjobs/UpdateStatusActiveOpenjobs/'+id,null).subscribe((data:any) => {
      this.showDeletedJobs();
      },
      (error: HttpErrorResponse) => {
      console.log (error.name + ' ' + error.message);
      });
  }
  showDeletedJobs(){
    this.httpClient.get('Openjobs/GetDeletedjobs').subscribe((data:any) => {
      this.jobs = data;
      this.isDeletedJobsShow = true;
      },
      (error: HttpErrorResponse) => {
      console.log (error.name + ' ' + error.message);
      });
  }
}
