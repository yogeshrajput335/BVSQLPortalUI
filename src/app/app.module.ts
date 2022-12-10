import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { AuthenticationInterceptor } from './core/services/authentication.interceptor';
import { IndexNavbarComponent } from './shared/index-navbar/index-navbar.component';
import { IndexComponent } from './features/index/index.component';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { TableComponent } from './samples/table/table.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatNativeDateModule } from '@angular/material/core';
import { StoreModule } from '@ngrx/store';
import { counterReducer } from './core/store/counter.reducers';
import { JwtModule } from '@auth0/angular-jwt';
import { tokenGetter } from './shared/login.module';


@NgModule({
  declarations: [
    AppComponent,
    IndexComponent,
    IndexNavbarComponent,
    TableComponent,
    ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatNativeDateModule,
    StoreModule.forRoot({ count: counterReducer }),
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        allowedDomains: ["localhost:7037"],
        disallowedRoutes: []
      }
    })
  ],
  //providers: [AuthenticationInterceptor],

  bootstrap: [AppComponent]
})
export class AppModule { }
