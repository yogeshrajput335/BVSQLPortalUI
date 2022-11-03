import { TableComponent } from './samples/table/table.component';
import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthenticationGuard } from './core/services/authentication-guard.guard';
import { IndexComponent } from './features/index/index.component';

const routes: Routes = [
  // admin views
  {
    path: "admin",
    loadChildren: () => import('./shared/admin.module').then(m => m.AdminModule),
    canActivate: [AuthenticationGuard]
  },
  // auth views
  {
    path: "login",
    loadChildren: () => import('./shared/login.module').then(m => m.LoginModule),
    //canActivate: [AuthenticationGuard]
  },
  { path: "table", component: TableComponent },
  { path: "", component: IndexComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes,{
    preloadingStrategy: PreloadAllModules
 })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
