import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {Component, Inject} from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import { Holiday } from '../../models/Holiday';
import { HolidayDataService } from '../../services/holiday-data.service';

@Component({
  selector: 'app-add-holiday.dialog',
  templateUrl: '../../dialogs/add/add-holiday.dialog.html',
  styleUrls: ['../../dialogs/add/add-holiday.dialog.css']
})

export class AddHolidayDialogComponent {
  statuses:any
  constructor(public dialogRef: MatDialogRef<AddHolidayDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: Holiday,
              public dataService: HolidayDataService) {
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
  // empty stuff
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  public confirmAdd(): void {
    this.dataService.addHoliday(this.data);
  }
}
