import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {Component, Inject} from '@angular/core';
import { AssetDataService } from '../../services/asset-data.service';

@Component({
  selector: 'app-delete-asset.dialog',
  templateUrl: '../../dialogs/delete/delete-asset.dialog.html',
  styleUrls: ['../../dialogs/delete/delete-asset.dialog.css']
})
export class DeleteAssetDialogComponent {

  constructor(public dialogRef: MatDialogRef<DeleteAssetDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any, public dataService: AssetDataService) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

  confirmDelete(): void {
    this.dataService.deleteAsset(this.data.id);
  }
}
