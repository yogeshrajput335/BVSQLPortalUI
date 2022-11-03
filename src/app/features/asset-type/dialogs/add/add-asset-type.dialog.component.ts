import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {Component, Inject} from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import {AssetType} from '../../models/AssetType';
import { AssetTypeDataService } from '../../services/asset-type-data.service';

@Component({
  selector: 'app-add-asset-type.dialog',
  templateUrl: '../../dialogs/add/add-asset-type.dialog.html',
  styleUrls: ['../../dialogs/add/add-asset-type.dialog.css']
})

export class AddAssetTypeDialogComponent {
  statuses:any
  assetTypes:any
  constructor(public dialogRef: MatDialogRef<AddAssetTypeDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: AssetType,
              public dataService: AssetTypeDataService) {
                this.statuses = this.dataService.getStatues()
               }

  formControl = new FormControl('', [
    Validators.required
    // Validators.email,
  ]);

  getErrorMessage() {
    return this.formControl.hasError('required') ? 'Required field' :
      this.formControl.hasError('email') ? 'Not a valid email' :
        '';
  }

  submit() {
  // empty stuff
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  public confirmAdd(): void {
    this.dataService.addAssetType(this.data);
  }
}
