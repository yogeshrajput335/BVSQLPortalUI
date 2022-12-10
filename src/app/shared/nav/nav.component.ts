import { Component } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { Router } from '@angular/router';
import { environment } from "src/environments/environment";
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent {
  count$: Observable<any>;
  companyName=''
  user:any
  userType:any
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  constructor(private breakpointObserver: BreakpointObserver,private authService: AuthenticationService,
     private route: Router, private store: Store<{ count: number }>) {
    this.count$ = store.select('count');
    this.companyName = environment.companyName;
    this.user = this.authService.getUser();
    this.userType = this.user.userType
  }

  Logout(){
    this.authService.logout();
    this.route.navigate(['/login']);
  }

}
