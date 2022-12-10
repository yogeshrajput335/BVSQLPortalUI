import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { EmployeeDataService } from '../../services/employee-data.service';
import { FormControl, Validators } from '@angular/forms';
import { Employee } from '../../models/Employee';

@Component({
  selector: 'app-add-employee.dialog',
  templateUrl: '../../dialogs/add/add-employee.dialog.html',
  styleUrls: ['../../dialogs/add/add-employee.dialog.css']
})

export class AddEmployeeDialogComponent {
  statuses: any
  empTypes: any
  constructor(public dialogRef: MatDialogRef<AddEmployeeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Employee,
    public dataService: EmployeeDataService) {
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

  public confirmAdd(): void {
    this.dataService.addEmployee(this.data);
  }
}
