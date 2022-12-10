import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { AssetTypeDataService } from '../../services/asset-type-data.service';

@Component({
  selector: 'app-delete-asset-type.dialog',
  templateUrl: '../../dialogs/delete/delete-asset-type.dialog.html',
  styleUrls: ['../../dialogs/delete/delete-asset-type.dialog.css']
})
export class DeleteAssetTypeDialogComponent {

  constructor(public dialogRef: MatDialogRef<DeleteAssetTypeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, public dataService: AssetTypeDataService) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

  confirmDelete(): void {
    this.dataService.deleteAssetType(this.data.id);
  }
}
