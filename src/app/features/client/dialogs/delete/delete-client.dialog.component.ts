import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {Component, Inject} from '@angular/core';
import {ClientDataService} from '../../services/client-data.service';

@Component({
  selector: 'app-delete-client.dialog',
  templateUrl: '../../dialogs/delete/delete-client.dialog.html',
  styleUrls: ['../../dialogs/delete/delete-client.dialog.css']
})
export class DeleteClientDialogComponent {

  constructor(public dialogRef: MatDialogRef<DeleteClientDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any, public dataService: ClientDataService) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

  confirmDelete(): void {
    this.dataService.deleteClient(this.data.id);
  }
}
