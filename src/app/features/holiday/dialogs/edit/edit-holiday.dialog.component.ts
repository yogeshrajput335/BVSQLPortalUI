import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {Component, Inject} from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import { HolidayDataService } from '../../services/holiday-data.service';

@Component({
  selector: 'app-edit-holiday.dialog',
  templateUrl: '../../dialogs/edit/edit-holiday.dialog.html',
  styleUrls: ['../../dialogs/edit/edit-holiday.dialog.css']
})
export class EditHolidayDialogComponent {
  statuses:any
  constructor(public dialogRef: MatDialogRef<EditHolidayDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any, public dataService: HolidayDataService) {
                this.statuses = this.dataService.getStatues()
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
    this.dataService.updateHoliday(this.data);
  }
}
