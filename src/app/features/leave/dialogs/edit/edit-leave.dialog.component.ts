import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {Component, Inject} from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import { LeaveDataService } from '../../services/leave-data.service';

@Component({
  selector: 'app-edit-leave.dialog',
  templateUrl: '../../dialogs/edit/edit-leave.dialog.html',
  styleUrls: ['../../dialogs/edit/edit-leave.dialog.css']
})
export class EditLeaveDialogComponent {
  statuses:any
  leaveTypes:any
  employees:any
  constructor(public dialogRef: MatDialogRef<EditLeaveDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any, public dataService: LeaveDataService) {
                this.statuses = this.dataService.getStatues()
                this.leaveTypes = this.dataService.getLeaveTypes()
                this.employees = this.dataService.getEmployees()
                console.log(data)
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
    this.dataService.updateLeave(this.data);
  }
}
