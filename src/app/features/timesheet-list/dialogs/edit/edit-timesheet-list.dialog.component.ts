import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import {TimesheetListDataService } from '../../services/timesheet-list-data.service';

@Component({
  selector: 'app-edit-timesheet-list.dialog',
  templateUrl: '../../dialogs/edit/edit-timesheet-list.dialog.html',
  styleUrls: ['../../dialogs/edit/edit-timesheet-list.dialog.css']
})
export class EditTimesheetListDialogComponent {
  statuses: any
  projects: any
  employees: any
  constructor(public dialogRef: MatDialogRef<EditTimesheetListDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, public dataService: TimesheetListDataService) {
    this.statuses = this.dataService.getStatues()
    this.projects = this.dataService.getProjects()
    this.employees = this.dataService.getEmployees()
  }

  formControl = new FormControl('', [
    Validators.required
  ]);

  getErrorMessage() {
    return this.formControl.hasError('required') ? 'Required field' :
      this.formControl.hasError('email') ? 'Not a valid email' :
        '';
  }

  submit() {
    
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  stopEdit(): void {
    this.dataService.updateTimesheetList(this.data);
  }
}
