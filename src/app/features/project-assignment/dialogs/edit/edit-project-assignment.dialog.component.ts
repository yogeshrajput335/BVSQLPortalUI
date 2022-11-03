import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {Component, Inject} from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import { ProjectAssignmentDataService } from '../../services/project-assignment-data.service';

@Component({
  selector: 'app-edit-project-assignment.dialog',
  templateUrl: '../../dialogs/edit/edit-project-assignment.dialog.html',
  styleUrls: ['../../dialogs/edit/edit-project-assignment.dialog.css']
})
export class EditProjectAssignmentDialogComponent {
  projects:any
  employees:any
  constructor(public dialogRef: MatDialogRef<EditProjectAssignmentDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any, public dataService: ProjectAssignmentDataService) {
                this.projects = this.dataService.getProjects()
                this.employees = this.dataService.getEmployees()
                console.log(data)
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
    // emppty stuff
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  stopEdit(): void {
    this.dataService.updateProjectAssignment(this.data);
  }
}
