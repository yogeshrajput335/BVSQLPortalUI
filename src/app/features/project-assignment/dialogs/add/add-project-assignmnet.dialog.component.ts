import { Project } from './../../../project/models/Project';
import { Employee } from './../../../employee/models/Employee';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ProjectAssignment } from '../../models/ProjectAssignment';
import { ProjectAssignmentDataService } from '../../services/project-assignment-data.service';

@Component({
  selector: 'app-add-project-assignment.dialog',
  templateUrl: '../../dialogs/add/add-project-assignment.dialog.html',
  styleUrls: ['../../dialogs/add/add-project-assignment.dialog.css']
})

export class AddProjectAssignmentDialogComponent {
  projects: any
  employees: any
  constructor(public dialogRef: MatDialogRef<AddProjectAssignmentDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ProjectAssignment,
    public dataService: ProjectAssignmentDataService) {
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

  public confirmAdd(): void {
    this.dataService.addProjectAssignment(this.data);
  }
}
