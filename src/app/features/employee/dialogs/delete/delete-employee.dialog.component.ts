import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {Component, Inject} from '@angular/core';
import {EmployeeDataService} from '../../services/employee-data.service';

@Component({
  selector: 'app-delete-employee.dialog',
  templateUrl: '../../dialogs/delete/delete-employee.dialog.html',
  styleUrls: ['../../dialogs/delete/delete-employee.dialog.css']
})
export class DeleteEmployeeDialogComponent {

  constructor(public dialogRef: MatDialogRef<DeleteEmployeeDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any, public dataService: EmployeeDataService) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

  confirmDelete(): void {
    this.dataService.deleteEmployee(this.data.id);
  }
}
