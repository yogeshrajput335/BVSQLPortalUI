import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { LeaveTypeDataService } from '../../services/leave-type-data.service';

@Component({
  selector: 'app-edit-leave-type.dialog',
  templateUrl: '../../dialogs/edit/edit-leave-type.dialog.html',
  styleUrls: ['../../dialogs/edit/edit-leave-type.dialog.css']
})
export class EditLeaveTypeDialogComponent {
  statuses: any
  constructor(public dialogRef: MatDialogRef<EditLeaveTypeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, public dataService: LeaveTypeDataService) {
    this.statuses = this.dataService.getStatues()
  }

  formControl = new FormControl('', [
    Validators.required
  ]);

  getErrorMessage() {
    return this.formControl.hasError('required') ? 'Required field' :
      this.formControl.hasError('email') ? 'Not a valid email' :
        '';
  }

  submit() {
    
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  stopEdit(): void {
    this.dataService.updateLeaveType(this.data);
  }
}
