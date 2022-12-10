import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {Component, Inject} from '@angular/core';
import { LeaveDataService } from '../../services/leave-data.service';

@Component({
  selector: 'app-delete-leave.dialog',
  templateUrl: '../../dialogs/delete/delete-leave.dialog.html',
  styleUrls: ['../../dialogs/delete/delete-leave.dialog.css']
})
export class DeleteLeaveDialogComponent {

  constructor(public dialogRef: MatDialogRef<DeleteLeaveDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any, public dataService: LeaveDataService) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

  confirmDelete(): void {
    this.dataService.deleteLeave(this.data.id);
  }
}
