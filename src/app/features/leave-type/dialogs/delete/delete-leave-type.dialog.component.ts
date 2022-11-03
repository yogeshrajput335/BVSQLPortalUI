import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {Component, Inject} from '@angular/core';
import { LeaveTypeDataService } from '../../services/leave-type-data.service';


@Component({
  selector: 'app-delete-leave-type.dialog',
  templateUrl: '../../dialogs/delete/delete-leave-type.dialog.html',
  styleUrls: ['../../dialogs/delete/delete-leave-type.dialog.css']
})
export class DeleteLeaveTypeDialogComponent {

  constructor(public dialogRef: MatDialogRef<DeleteLeaveTypeDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any, public dataService: LeaveTypeDataService) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

  confirmDelete(): void {
    this.dataService.deleteLeaveType(this.data.id);
  }
}
