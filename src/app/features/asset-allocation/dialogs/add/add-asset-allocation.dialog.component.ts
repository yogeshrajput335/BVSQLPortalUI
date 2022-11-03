import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {Component, Inject} from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import { AssetAllocation } from '../../models/AssetAllocation';
import { AssetAllocationDataService } from '../../services/asset-allocation-data.service';

@Component({
  selector: 'app-add-asset-allocation.dialog',
  templateUrl: '../../dialogs/add/add-asset-allocation.dialog.html',
  styleUrls: ['../../dialogs/add/add-asset-allocation.dialog.css']
})

export class AddAssetAllocationDialogComponent {
  statuses:any
  assets:any
  employees:any
  constructor(public dialogRef: MatDialogRef<AddAssetAllocationDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: AssetAllocation,
              public dataService: AssetAllocationDataService) {
                this.statuses = this.dataService.getStatues()
                this.assets = this.dataService.getAssets()
                this.employees = this.dataService.getEmployees()
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
    this.dataService.addAssetAllocation(this.data);
  }
}
