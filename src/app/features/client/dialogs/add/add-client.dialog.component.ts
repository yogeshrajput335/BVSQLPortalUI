import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { ClientDataService } from '../../services/client-data.service';
import { FormControl, Validators } from '@angular/forms';
import { Client } from '../../models/Client';

@Component({
  selector: 'app-add-client.dialog',
  templateUrl: '../../dialogs/add/add-client.dialog.html',
  styleUrls: ['../../dialogs/add/add-client.dialog.css']
})

export class AddClientDialogComponent {
  statuses: any
  constructor(public dialogRef: MatDialogRef<AddClientDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Client,
    public dataService: ClientDataService) {
    this.statuses = this.dataService.getStatues()
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
    this.dataService.addClient(this.data);
  }
}
