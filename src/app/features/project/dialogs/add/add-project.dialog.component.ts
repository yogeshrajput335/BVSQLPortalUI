import { LeaveType } from './../../../leave-type/models/LeaveType';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {Component, Inject} from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import { Project } from '../../models/Project';
import { ProjectDataService } from '../../services/project-data.service';

@Component({
  selector: 'app-add-Project.dialog',
  templateUrl: '../../dialogs/add/add-Project.dialog.html',
  styleUrls: ['../../dialogs/add/add-Project.dialog.css']
})

export class AddProjectDialogComponent {
  statuses:any
  projectTypes:any
  clients:any
  constructor(public dialogRef: MatDialogRef<AddProjectDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: Project,
              public dataService: ProjectDataService) {
                this.statuses = this.dataService.getStatues()
                this.projectTypes = this.dataService.getProjectTypes()
                this.clients = this.dataService.getClients()
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
    this.dataService.addProject(this.data);
  }
}
