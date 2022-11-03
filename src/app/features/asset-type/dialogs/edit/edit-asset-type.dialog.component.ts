import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {Component, Inject} from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import { AssetTypeDataService } from '../../services/asset-type-data.service';

@Component({
  selector: 'app-edit-asset-type.dialog',
  templateUrl: '../../dialogs/edit/edit-asset-type.dialog.html',
  styleUrls: ['../../dialogs/edit/edit-asset-type.dialog.css']
})
export class EditAssetTypeDialogComponent {
  statuses:any
  assetTypes:any
  constructor(public dialogRef: MatDialogRef<EditAssetTypeDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any, public dataService: AssetTypeDataService) {
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
    // emppty stuff
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  stopEdit(): void {
    this.dataService.updateAssetType(this.data);
  }
}
