import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {Component, Inject} from '@angular/core';
import {ClientDataService} from '../../services/client-data.service';
import {FormControl, Validators} from '@angular/forms';

@Component({
  selector: 'app-edit-client.dialog',
  templateUrl: '../../dialogs/edit/edit-client.dialog.html',
  styleUrls: ['../../dialogs/edit/edit-client.dialog.css']
})
export class EditClientDialogComponent {
  statuses:any
  constructor(public dialogRef: MatDialogRef<EditClientDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any, public dataService: ClientDataService) {
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
    this.dataService.updateClient(this.data);
  }
}
