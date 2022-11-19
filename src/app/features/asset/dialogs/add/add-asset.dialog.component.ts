import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Asset } from '../../models/Asset';
import { AssetDataService } from '../../services/asset-data.service';

@Component({
  selector: 'app-add-asset.dialog',
  templateUrl: '../../dialogs/add/add-asset.dialog.html',
  styleUrls: ['../../dialogs/add/add-asset.dialog.css']
})

export class AddAssetDialogComponent {
  statuses: any
  assetTypes: any
  constructor(public dialogRef: MatDialogRef<AddAssetDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Asset,
    public dataService: AssetDataService) {
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

  public confirmAdd(): void {
    this.dataService.addAsset(this.data);
  }
}
