import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {Component, Inject} from '@angular/core';
import {UserDataService} from '../../services/user-data.service';


@Component({
  selector: 'app-delete-user.dialog',
  templateUrl: '../../dialogs/delete/delete-user.dialog.html',
  styleUrls: ['../../dialogs/delete/delete-user.dialog.css']
})
export class DeleteUserDialogComponent {

  constructor(public dialogRef: MatDialogRef<DeleteUserDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any, public dataService: UserDataService) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

  confirmDelete(): void {
    this.dataService.deleteUser(this.data.id);
  }
}
