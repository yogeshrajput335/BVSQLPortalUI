import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {Component, Inject} from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import { InvoiceDetailsDataService } from '../../services/invoice-details-data.service';

@Component({
  selector: 'app-edit-invoice-details.dialog',
  templateUrl: '../../dialogs/edit/edit-invoice-details.dialog.html',
  styleUrls: ['../../dialogs/edit/edit-invoice-details.dialog.css']
})
export class EditInvoiceDetailsDialogComponent {
  clients:any
  statuses:any
  terms :any

  invoiceDetails:any
  constructor(public dialogRef: MatDialogRef<EditInvoiceDetailsDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any, public dataService: InvoiceDetailsDataService) {
                this.statuses = this.dataService.getStatuses()
                this.clients = this.dataService.getClients()
                this.terms = this.dataService.getTerms()
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
    this.dataService.updateInvoiceDetails(this.data);
  }
}
