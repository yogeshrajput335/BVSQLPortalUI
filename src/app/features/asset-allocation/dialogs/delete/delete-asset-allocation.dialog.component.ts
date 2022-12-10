import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {Component, Inject} from '@angular/core';
import { AssetAllocationDataService } from '../../services/asset-allocation-data.service';

@Component({
  selector: 'app-delete-asset-allocation.dialog',
  templateUrl: '../../dialogs/delete/delete-asset-allocation.dialog.html',
  styleUrls: ['../../dialogs/delete/delete-asset-allocation.dialog.css']
})
export class DeleteAssetAllocationDialogComponent {

  constructor(public dialogRef: MatDialogRef<DeleteAssetAllocationDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any, public dataService: AssetAllocationDataService) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

  confirmDelete(): void {
    this.dataService.deleteAssetAllocation(this.data.id);
  }
}
