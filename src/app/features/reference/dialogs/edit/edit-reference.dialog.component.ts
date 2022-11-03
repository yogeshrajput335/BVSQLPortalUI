import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {Component, Inject} from '@angular/core';
import {ReferenceDataService} from '../../services/reference-data.service';
import {FormControl, Validators} from '@angular/forms';

@Component({
  selector: 'app-edit-reference.dialog',
  templateUrl: '../../dialogs/edit/edit-reference.dialog.html',
  styleUrls: ['../../dialogs/edit/edit-reference.dialog.css']
})
export class EditReferenceDialogComponent {
  statuses:any
  constructor(public dialogRef: MatDialogRef<EditReferenceDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any, public dataService:ReferenceDataService) {
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
    this.dataService.updateReference(this.data);
  }
}
