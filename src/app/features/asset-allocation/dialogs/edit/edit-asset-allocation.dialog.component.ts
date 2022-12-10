import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { AssetAllocationDataService } from '../../services/asset-allocation-data.service';

@Component({
  selector: 'app-edit-asset-allocation.dialog',
  templateUrl: '../../dialogs/edit/edit-asset-allocation.dialog.html',
  styleUrls: ['../../dialogs/edit/edit-asset-allocation.dialog.css']
})
export class EditAssetAllocationDialogComponent {
  statuses: any
  assets: any
  employees: any
  constructor(public dialogRef: MatDialogRef<EditAssetAllocationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, public dataService: AssetAllocationDataService) {
    this.statuses = this.dataService.getStatues()
    this.assets = this.dataService.getAssets()
    this.employees = this.dataService.getEmployees()
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
    this.dataService.updateAssetAllocation(this.data);
  }
}
