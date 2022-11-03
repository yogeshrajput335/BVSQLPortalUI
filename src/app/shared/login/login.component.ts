import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from "src/app/core/services/authentication.service";
import { HttpCommonService } from "src/app/core/services/httpCommon.service";
import { environment } from "src/environments/environment";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  public loginForm = new FormGroup({
    username: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required)
  });
  companyName: any;

  get usernameControl(): FormControl {
    return this.loginForm.get('username') as FormControl;
  }

  get passwordControl(): FormControl {
    return this.loginForm.get('password') as FormControl;
  }

  constructor(private authenticationService: AuthenticationService,
    private route: Router,
    private httpService:HttpCommonService) {
      this.companyName = environment.companyName;
    }

  ngOnInit(): void {
    this.loginForm.controls['username'].setValue('');
    this.loginForm.controls['password'].setValue('');
  }

  onSignIn() {
    let username = this.loginForm.get('username')!.value;
    let password = this.loginForm.get('password')!.value;
    this.authenticationService.login(username!, password);
  }
}
