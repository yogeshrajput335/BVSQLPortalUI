import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {Component, Inject} from '@angular/core';
import {EmployeeDataService} from '../../services/employee-data.service';
import { HttpCommonService } from 'src/app/core/services/httpCommon.service';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthenticationService } from 'src/app/core/services/authentication.service';


@Component({
  selector: 'app-set-clientperhour.dialog',
  templateUrl: '../../dialogs/set-clientperhour/set-clientperhour.dialog.html',
  styleUrls: ['../../dialogs/set-clientperhour/set-clientperhour.dialog.css']
})
export class SetClientPerHourDialogComponent {
  perHour:any
  clientPerHourData:any
  clientPerHourHistory:any
  clientPerHourHistoryInitial:any
  clients:any
  projects:any
  client:any
  clientProjects:any
  setProject:any
  clientForHistory:any
  openAdd= false
  reasonForChange:any
  constructor(public dialogRef: MatDialogRef<SetClientPerHourDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any, public dataService: EmployeeDataService,
              private httpClient: HttpCommonService, private authService: AuthenticationService) {
                this.clients = this.dataService.getClients();
                this.projects = this.dataService.getProjects();
                this.perHour = data.perHour;
                this.httpClient.get('Employee/GetEmpClientPerHour').subscribe((data:any) => {
                  this.clientPerHourData = data.filter((x:any)=>x.employeeId == this.data.id);
                },
                (error: HttpErrorResponse) => {
                console.log (error.name + ' ' + error.message);
                });
                this.httpClient.get('Employee/GetEmpClientPerHourHistory/'+this.data.id).subscribe((data:any) => {
                  //this.dataChange.next(data);
                  this.clientPerHourHistory = data;
                  this.clientPerHourHistoryInitial = data;
                },
                (error: HttpErrorResponse) => {
                console.log (error.name + ' ' + error.message);
                });
              }

  onNoClick(): void {
    this.dialogRef.close();
  }

  confirm(): void {
    this.dataService.setClientPerHour(this.data.id,this.perHour,this.client,this.reasonForChange,(this.authService.getUser() as any).employeeId).subscribe((data:any) => {
      this.openAdd = false;
    },
    (error: HttpErrorResponse) => {
    console.log (error.name + ' ' + error.message);
    });
  }
  onClientChange(){
    this.clientPerHourHistory = this.clientPerHourHistoryInitial.filter((x:any)=>x.clientId == this.clientForHistory || this.clientForHistory===0|| this.clientForHistory==='0')
  }
}
