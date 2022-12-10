import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { HttpCommonService } from './httpCommon.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  userList:any
  constructor(private httpService:HttpCommonService,  private route: Router) { }
  token=''
  login(username: string, password: any) {
    let u = {username:username,password:password}
    this.httpService.post("User/VerifyUser",u).subscribe(
      data=>{
        this.userList = (data as any).user;
        this.token =  (data as any).token;

        if (this.userList) {
          localStorage.setItem("token", this.token);
          //localStorage.setItem("jwt", this.token);
          localStorage.setItem("user", JSON.stringify(this.userList));
          this.route.navigate(['/admin/dashboard'])
        } else {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          alert('Invalid username/password.')
        }
      }
    );
  }

  logout(): void {
    localStorage.removeItem("token");
    localStorage.removeItem("userType")
  }

  isUserLoggedIn(): boolean {
    if (localStorage.getItem("token") != null) {
      return true;
    }
    return false;
  }
  getUserType():string{
    if (localStorage.getItem("user") != null) {
      return JSON.parse(localStorage.getItem("user")!.toString()).userType;
    }
    return '';
  }
  getUser():any{
    if (localStorage.getItem("user") != null) {
      return JSON.parse(localStorage.getItem("user")!.toString());
    }
    return '';
  }
}
