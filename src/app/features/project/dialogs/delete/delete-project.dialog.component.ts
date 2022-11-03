import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {Component, Inject} from '@angular/core';
import { ProjectDataService } from '../../services/project-data.service';


@Component({
  selector: 'app-delete-project.dialog',
  templateUrl: '../../dialogs/delete/delete-project.dialog.html',
  styleUrls: ['../../dialogs/delete/delete-project.dialog.css']
})
export class DeleteProjectDialogComponent {

  constructor(public dialogRef: MatDialogRef<DeleteProjectDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any, public dataService: ProjectDataService) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

  confirmDelete(): void {
    this.dataService.deleteProject(this.data.id);
  }
}
