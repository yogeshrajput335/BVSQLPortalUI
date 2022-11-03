import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { HttpCommonService } from 'src/app/core/services/httpCommon.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  basicInfo:any
  contact:any
  constructor(public httpClient: HttpCommonService, private authenticationService: AuthenticationService) { }

  ngOnInit(): void {
    this.getEmployeeBasicInfo();
    this.getEmployeeContact();
  }

  getEmployeeBasicInfo(): void {
    this.httpClient.get('EmployeeBasicInfo/GetEmployeeBasicInfoByEmpId/'+this.authenticationService.getUser().employeeId).subscribe((data:any) => {
      this.basicInfo = data;
      },
      (error: HttpErrorResponse) => {
      console.log (error.name + ' ' + error.message);
      });

  }

  getEmployeeContact(): void {
    this.httpClient.get('EmployeeContact/GetEmployeeContactByEmpId/'+this.authenticationService.getUser().employeeId).subscribe((data:any) => {
      this.contact = data;
      },
      (error: HttpErrorResponse) => {
      console.log (error.name + ' ' + error.message);
      });

  }

}
