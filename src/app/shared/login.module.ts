import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { JwtModule } from "@auth0/angular-jwt";
import { AuthNavbarComponent } from "./auth-navbar/auth-navbar.component";
import { AuthComponent } from "./auth/auth.component";
import { LoginRoutingModule } from "./login-routing.module";
import { LoginComponent } from "./login/login.component";

export function tokenGetter() {
  return localStorage.getItem("token");
}

@NgModule({
  declarations: [LoginComponent,AuthComponent,AuthNavbarComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    LoginRoutingModule,

  ]
})
export class LoginModule { }
