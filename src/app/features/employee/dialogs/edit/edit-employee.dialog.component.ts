import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { EmployeeDataService } from '../../services/employee-data.service';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-edit-employee.dialog',
  templateUrl: '../../dialogs/edit/edit-employee.dialog.html',
  styleUrls: ['../../dialogs/edit/edit-employee.dialog.css']
})
export class EditEmployeeDialogComponent {
  statuses: any
  empTypes: any
  constructor(public dialogRef: MatDialogRef<EditEmployeeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, public dataService: EmployeeDataService) {
    this.statuses = this.dataService.getStatues()
    this.empTypes = this.dataService.getEmployeeTypes()
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
    this.dataService.updateEmployee(this.data);
  }
}
