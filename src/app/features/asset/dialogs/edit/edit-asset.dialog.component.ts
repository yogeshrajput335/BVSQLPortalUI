import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { AssetDataService } from '../../services/asset-data.service';

@Component({
  selector: 'app-edit-asset.dialog',
  templateUrl: '../../dialogs/edit/edit-asset.dialog.html',
  styleUrls: ['../../dialogs/edit/edit-asset.dialog.css']
})
export class EditAssetDialogComponent {
  statuses: any
  assetTypes: any
  constructor(public dialogRef: MatDialogRef<EditAssetDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, public dataService: AssetDataService) {
    this.statuses = this.dataService.getStatues()
    this.assetTypes = this.dataService.getAssetTypes()
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
    this.dataService.updateAsset(this.data);
  }
}
