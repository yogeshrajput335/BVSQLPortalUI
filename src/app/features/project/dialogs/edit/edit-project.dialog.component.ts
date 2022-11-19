import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {Component, Inject} from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import { ProjectDataService } from '../../services/project-data.service';

@Component({
  selector: 'app-edit-project.dialog',
  templateUrl: '../../dialogs/edit/edit-project.dialog.html',
  styleUrls: ['../../dialogs/edit/edit-project.dialog.css']
})
export class EditProjectDialogComponent {
  statuses:any
  projectTypes:any
  clients:any
  constructor(public dialogRef: MatDialogRef<EditProjectDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any, public dataService: ProjectDataService) {
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
    // emppty stuff
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  stopEdit(): void {
    this.dataService.updateProject(this.data);
  }
}
