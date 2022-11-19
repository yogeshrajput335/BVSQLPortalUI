import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {Component, ElementRef, Inject, ViewChild} from '@angular/core';
import { InvoiceDetailsDataService} from '../../services/invoice-details-data.service';

import { jsPDF } from "jspdf";
import html2canvas from 'html2canvas';
import { HttpCommonService } from 'src/app/core/services/httpCommon.service';
import { HttpErrorResponse } from '@angular/common/http';


@Component({
  selector: 'app-invoice-dialog.dialog',
  templateUrl: '../../dialogs/invoice-dialog/invoice-dialog.dialog.html',
  styleUrls: ['../../dialogs/invoice-dialog/invoice-dialog.dialog.css']
})
export class InvoiceDialogComponent {
  invoice:any;
  totalCost:number = 0;
  constructor(public dialogRef: MatDialogRef<InvoiceDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any, public dataService: InvoiceDetailsDataService,
              private httpClient: HttpCommonService) {
                this.httpClient.get('Invoice/GetInvoiceById/'+this.data.id).subscribe((data:any) => {
                  //this.dataChange.next(data);
                  this.invoice = data;
                  this.invoice.products.forEach((e:any) => {
                    this.totalCost += e.totalCost;
                  });
                },
                (error: HttpErrorResponse) => {
                console.log (error.name + ' ' + error.message);
                });
              }

  onNoClick(): void {
    this.dialogRef.close();
  }

  confirmDelete(): void {
    this.dataService.deleteInvoiceDetails(this.data.id);
  }
  @ViewChild('html2Pdf') htmlPdf?: ElementRef;

  print(){
   const DATA = this.htmlPdf?.nativeElement;
   html2canvas(DATA).then(canvas => {
     let fileWidth = 200;
     let fileHeight = canvas.height * fileWidth / canvas.width;

     const FILEURI = canvas.toDataURL('image/png')
     let PDF = new jsPDF('p', 'mm', 'a4');
     let position = 0;
     PDF.addImage(FILEURI, 'PNG', 5, 5, fileWidth, fileHeight)
     PDF.save('invoice.pdf');
   });
  }
}
