import { InvoicesComponent } from './../features/invoices/invoices.component';
import { HolidayComponent } from './../features/holiday/holiday.component';
import { CandidateComponent } from './../features/candidate/candidate.component';
import { ReferenceComponent } from './../features/reference/reference.component';
import { TimesheetApprovalComponent } from './../features/timesheet-approval/timesheet-approval.component';
import { TimesheetDetailComponent } from './../features/timesheet-detail/timesheet-detail.component';
import { ProjectAssignmentComponent } from './../features/project-assignment/project-assignment.component';
import { AssetAllocationComponent } from './../features/asset-allocation/asset-allocation.component';
import { AssetTypeComponent } from './../features/asset-type/asset-type.component';
import { JobsComponent } from './../features/jobs/jobs.component';
import { LeaveComponent } from './../features/leave/leave.component';
import { OrganizationalStructureComponent } from './../features/organizational-structure/organizational-structure.component';
import { GlobalSettingsComponent } from './../features/global-settings/global-settings.component';
import { ProfileComponent } from './../features/profile/profile.component';
import { LeaveTypeComponent } from './../features/leave-type/leave-type.component';
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { DashboardComponent } from "../features/dashboard/dashboard.component";
import { TimesheetComponent } from "../features/timesheet/timesheet.component";
import { UsersComponent } from "../features/users/users.component";
import { AdminComponent } from "./admin/admin.component";
import { ClientComponent } from './../features/client/client.component';
import { ProjectComponent } from '../features/project/project.component';
import { AssetComponent } from '../features/asset/asset.component';
import { EmployeeComponent } from '../features/employee/employee.component';
import { InvoiceDetailsComponent } from '../features/invoice_details/invoice-details.component';

const routes: Routes = [
  {
    path: "",
    component: AdminComponent,
    children: [
      { path: "dashboard", component: DashboardComponent },
      { path: "users", component: UsersComponent },
      { path: "timesheet", component: TimesheetComponent },
      { path: "leave-type", component: LeaveTypeComponent },
      { path: "client", component: ClientComponent },
      { path: "project", component: ProjectComponent },
      { path: "profile", component: ProfileComponent },
      { path: "settings", component: GlobalSettingsComponent },
      { path: "org-structure", component: OrganizationalStructureComponent },
      { path: "leave", component: LeaveComponent },
      { path: "jobs", component: JobsComponent },
      { path: "reference", component: ReferenceComponent },
      { path: "candidate", component: CandidateComponent },
      { path: "jobs", component: JobsComponent },
      { path: "asset", component: AssetComponent },
      { path: "asset-type", component: AssetTypeComponent },
      { path: "asset-allocation", component: AssetAllocationComponent },
      { path: "project-assignment", component: ProjectAssignmentComponent },
      { path: "timesheet-detail", component: TimesheetDetailComponent },
      { path: "timesheet-approval", component: TimesheetApprovalComponent },
      { path: "holiday", component: HolidayComponent },
      { path: "employee", component: EmployeeComponent },
      { path: "invoice", component: InvoicesComponent },
      { path: "invoice-details", component: InvoiceDetailsComponent },
      { path: "", redirectTo: "dashboard", pathMatch: "full" },
    ],
  },
  {
    path: '',
    redirectTo: 'admin/dashboard',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
