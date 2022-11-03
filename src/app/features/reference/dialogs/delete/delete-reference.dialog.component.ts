import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {Component, Inject} from '@angular/core';
import {ReferenceDataService} from '../../services/reference-data.service';


@Component({
  selector: 'app-delete-reference.dialog',
  templateUrl: '../../dialogs/delete/delete-reference.dialog.html',
  styleUrls: ['../../dialogs/delete/delete-reference.dialog.css']
})
export class DeleteReferenceDialogComponent {

  constructor(public dialogRef: MatDialogRef<DeleteReferenceDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any, public dataService: ReferenceDataService) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

  confirmDelete(): void {
    this.dataService.deleteReference(this.data.id);
  }
}
