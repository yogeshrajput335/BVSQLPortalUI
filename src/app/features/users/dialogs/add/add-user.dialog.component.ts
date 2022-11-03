import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {Component, Inject} from '@angular/core';
import {UserDataService} from '../../services/user-data.service';
import {FormControl, Validators} from '@angular/forms';
import {User} from '../../models/User';

@Component({
  selector: 'app-add-user.dialog',
  templateUrl: '../../dialogs/add/add-user.dialog.html',
  styleUrls: ['../../dialogs/add/add-user.dialog.css']
})

export class AddUserDialogComponent {
  statuses:any
  userTypes:any
  employees:any
  constructor(public dialogRef: MatDialogRef<AddUserDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: User,
              public dataService: UserDataService) {
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
  // empty stuff
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  public confirmAdd(): void {
    this.dataService.addUser(this.data);
  }
}
