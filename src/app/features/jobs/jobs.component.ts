import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { HttpCommonService } from 'src/app/core/services/httpCommon.service';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { JobsDialogComponent } from '../jobs/jobs-dialog/jobs-dialog.component';
import { JobsDataService } from './jobs-data.service';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { CandidateComponent } from '../candidate/candidate.component';
import { AddCandidateDialogComponent } from '../candidate/dialogs/add/add-candidate.dialog.component';


@Component({

  selector: 'app-jobs',

  templateUrl: './jobs.component.html',

  styleUrls: ['./jobs.component.scss']

})

export class JobsComponent implements OnInit {
    jobsDatabase?: JobsDataService | null;
    jobs:any[] = [];
    statuses = ['ACTIVE', 'INACTIVE','REFERRED']
    isDeletedJobsShow = false;

    constructor(public httpClient: HttpCommonService ,
              public dialog: MatDialog,
              public dataService: JobsDataService,
              private authService: AuthenticationService) { }

              ngOnInit() {
                this.getAllJobs();
              }

              addJobs(): void {
                const dialogRef = this.dialog.open(JobsDialogComponent, {

                });

                dialogRef.afterClosed().subscribe(result => {
                  this.getAllJobs();
                   // this.jobsDatabase!.dataChange.value.push(this.dataService.getDialogData());
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
  onApply (jobId: number): void {
    // this.dialogData = candidate;
    this.httpClient.post('Openjobs/ApplyJob',{jobId:jobId,employeeId:(this.authService.getUser() as any).employeeId}).subscribe((data:any) => {
      //this.dataChange.next(data);
    },
    (error: HttpErrorResponse) => {
    console.log (error.name + ' ' + error.message);
    });
  }
  openDialog(): void {
    const dialogRef = this.dialog.open(AddCandidateDialogComponent, {
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }
}
