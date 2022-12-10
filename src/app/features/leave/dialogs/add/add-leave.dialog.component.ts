import { LeaveType } from './../../../leave-type/models/LeaveType';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Leave } from '../../models/Leave';
import { LeaveDataService } from '../../services/leave-data.service';

@Component({
  selector: 'app-add-leave.dialog',
  templateUrl: '../../dialogs/add/add-leave.dialog.html',
  styleUrls: ['../../dialogs/add/add-leave.dialog.css']
})

export class AddLeaveDialogComponent {
  statuses: any
  leaveTypes: any
  employees: any
  constructor(public dialogRef: MatDialogRef<AddLeaveDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Leave,
    public dataService: LeaveDataService) {
    this.statuses = this.dataService.getStatues()
    this.leaveTypes = this.dataService.getLeaveTypes()
    this.employees = this.dataService.getEmployees()

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

  public confirmAdd(): void {
    this.dataService.addLeave(this.data);
  }
}
