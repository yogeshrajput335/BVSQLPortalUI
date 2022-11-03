import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {Component, Inject} from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import { LeaveType } from '../../models/LeaveType';
import { LeaveTypeDataService } from '../../services/leave-type-data.service';

@Component({
  selector: 'app-add-leave-type.dialog',
  templateUrl: '../../dialogs/add/add-leave-type.dialog.html',
  styleUrls: ['../../dialogs/add/add-leave-type.dialog.css']
})

export class AddLeaveTypeDialogComponent {
  statuses:any
  constructor(public dialogRef: MatDialogRef<AddLeaveTypeDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: LeaveType,
              public dataService: LeaveTypeDataService) {
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
    this.dataService.addLeaveType(this.data);
  }
}
