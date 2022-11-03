import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {Component, Inject} from '@angular/core';
import { HolidayDataService } from '../../services/holiday-data.service';


@Component({
  selector: 'app-delete-holiday.dialog',
  templateUrl: '../../dialogs/delete/delete-holiday.dialog.html',
  styleUrls: ['../../dialogs/delete/delete-holiday.dialog.css']
})
export class DeleteHolidayDialogComponent {

  constructor(public dialogRef: MatDialogRef<DeleteHolidayDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any, public dataService: HolidayDataService) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

  confirmDelete(): void {
    this.dataService.deleteHoliday(this.data.id);
  }
}
