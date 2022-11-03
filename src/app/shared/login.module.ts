import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { AuthNavbarComponent } from "./auth-navbar/auth-navbar.component";
import { AuthComponent } from "./auth/auth.component";
import { LoginRoutingModule } from "./login-routing.module";
import { LoginComponent } from "./login/login.component";


@NgModule({
  declarations: [LoginComponent,AuthComponent,AuthNavbarComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    LoginRoutingModule
  ]
})
export class LoginModule { }
