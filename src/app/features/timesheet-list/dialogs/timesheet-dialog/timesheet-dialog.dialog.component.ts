import { TimesheetListDataService } from './../../services/timesheet-list-data.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {Component, ElementRef, Inject, ViewChild} from '@angular/core';

import { jsPDF } from "jspdf";
import html2canvas from 'html2canvas';
import { HttpCommonService } from 'src/app/core/services/httpCommon.service';
import { HttpErrorResponse } from '@angular/common/http';


@Component({
  selector: 'app-timesheet-dialog.dialog',
  templateUrl: '../../dialogs/timesheet-dialog/timesheet-dialog.dialog.html',
  styleUrls: ['../../dialogs/timesheet-dialog/timesheet-dialog.dialog.css']
})
export class TimesheetDialogComponent {
  timesheet:any;
  totalHours:number = 0;
  today=new Date()
  constructor(public dialogRef: MatDialogRef<TimesheetDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any, public dataService: TimesheetListDataService,
              private httpClient: HttpCommonService) {
                this.httpClient.get('Timesheet/GetTimesheetById/'+this.data.id).subscribe((data:any) => {
                  //this.dataChange.next(data);
                  this.timesheet = data;
                  this.timesheet.detail.forEach((e:any) => {
                    this.totalHours += e.hours;
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
    //this.dataService.deleteInvoiceDetails(this.data.id);
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
     PDF.save('timesheet.pdf');
   });
  }
}
