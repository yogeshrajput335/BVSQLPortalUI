import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {Component, Inject} from '@angular/core';
import { InvoiceDetailsDataService} from '../../services/invoice-details-data.service';


@Component({
  selector: 'app-delete-invoice-details.dialog',
  templateUrl: '../../dialogs/delete/delete-invoice-details.dialog.html',
  styleUrls: ['../../dialogs/delete/delete-invoice-details.dialog.css']
})
export class DeleteInvoiceDetailsDialogComponent {

  constructor(public dialogRef: MatDialogRef<DeleteInvoiceDetailsDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any, public dataService: InvoiceDetailsDataService) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

  confirmDelete(): void {
    this.dataService.deleteInvoiceDetails(this.data.id);
  }
}
