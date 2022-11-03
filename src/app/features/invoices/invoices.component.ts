import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

import { jsPDF } from "jspdf";
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-invoices',
  templateUrl: './invoices.component.html',
  styleUrls: ['./invoices.component.scss']
})
export class InvoicesComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
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
  email(){

  }
}
