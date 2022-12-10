import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {Component, Inject} from '@angular/core';
import { TimesheetListDataService } from '../../services/timesheet-list-data.service';


@Component({
  selector: 'app-delete-timesheet-list.dialog',
  templateUrl: '../../dialogs/delete/delete-timesheet-list.dialog.html',
  styleUrls: ['../../dialogs/delete/delete-timesheet-list.dialog.css']
})
export class DeleteTimesheetListDialogComponent {

  constructor(public dialogRef: MatDialogRef<DeleteTimesheetListDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any, public dataService: TimesheetListDataService) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

  confirmDelete(): void {
    this.dataService.deleteTimesheetList(this.data.id);
  }
}
