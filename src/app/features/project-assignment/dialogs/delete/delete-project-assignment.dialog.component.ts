import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {Component, Inject} from '@angular/core';
import { ProjectAssignmentDataService } from '../../services/project-assignment-data.service';

@Component({
  selector: 'app-delete-project-assignment.dialog',
  templateUrl: '../../dialogs/delete/delete-project-assignment.dialog.html',
  styleUrls: ['../../dialogs/delete/delete-project-assignment.dialog.css']
})
export class DeleteProjectAssignmentDialogComponent {

  constructor(public dialogRef: MatDialogRef<DeleteProjectAssignmentDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any, public dataService: ProjectAssignmentDataService) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

  confirmDelete(): void {
    this.dataService.deleteProjectAssignment(this.data.id);
  }
}
