import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {Component, Inject} from '@angular/core';
import {UserDataService} from '../../services/user-data.service';
import {FormControl, Validators} from '@angular/forms';

@Component({
  selector: 'app-edit-user.dialog',
  templateUrl: '../../dialogs/edit/edit-user.dialog.html',
  styleUrls: ['../../dialogs/edit/edit-user.dialog.css']
})
export class EditUserDialogComponent {
  statuses:any
  userTypes:any
  employees:any
  constructor(public dialogRef: MatDialogRef<EditUserDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any, public dataService: UserDataService) {
                this.statuses = this.dataService.getStatues()
                this.userTypes = this.dataService.getUserTypes()
                this.employees = this.dataService.getEmployees()
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
    this.dataService.updateUser(this.data);
  }
}
