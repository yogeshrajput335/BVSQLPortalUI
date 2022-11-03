import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {Component, Inject} from '@angular/core';
import {ReferenceDataService} from '../../services/reference-data.service';
import {FormControl, Validators} from '@angular/forms';
import {Reference} from '../../models/Reference';

@Component({
  selector: 'app-add-reference.dialog',
  templateUrl: '../../dialogs/add/add-reference.dialog.html',
  styleUrls: ['../../dialogs/add/add-reference.dialog.css']
})

export class AddReferenceDialogComponent {
  statuses:any
  empTypes:any
  constructor(public dialogRef: MatDialogRef<AddReferenceDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: Reference,
              public dataService: ReferenceDataService) {
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
    this.dataService.addReference(this.data);
  }
}
