import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {FormControl , Validators} from '@angular/forms';
import { Jobs } from '../Jobs';
import { JobsDataService } from '../jobs-data.service';



@Component({
  selector: 'app-jobs-dialog',
  templateUrl: './jobs-dialog.component.html',
  styleUrls: ['./jobs-dialog.component.scss']
})
export class JobsDialogComponent implements OnInit {
  data :Jobs={jobName:'',profile:'',description:'',startDate:new Date(),country:'',status:''}


  constructor(public dialogRef: MatDialogRef<JobsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data1: Jobs,
     public dataService: JobsDataService){
    

  }
  formControl = new FormControl('', [
    Validators.required
    // Validators.email,
  ]);

  getErrorMessage() {
    return this.formControl.hasError('required') ? 'Required field' :
      this.formControl.hasError('email') ? 'Not a valid email' :
        '';
  }
 
  submit() {
    // empty stuff
    }
  
  onNoClick(): void {
      this.dialogRef.close();
    }

  public confirmAdd(): void {
    this.data.startDate=new Date();
    this.data.country="";
    this.data.status="ACTIVE";
    this.dataService.addJobs(this.data);
    }

  ngOnInit(): void {
  }

}
