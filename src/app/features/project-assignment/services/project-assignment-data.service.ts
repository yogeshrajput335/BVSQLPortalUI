import { Employee } from './../../employee/models/Employee';
import { Project } from './../../project/models/Project';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ProjectAssignment } from '../models/ProjectAssignment';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { HttpCommonService } from 'src/app/core/services/httpCommon.service';

@Injectable()
export class ProjectAssignmentDataService {
  projects = [{ id: 0, projectName: '' }];
  employees = [{ id: 0, firstName: '', lastName: '' }];
  dataChange: BehaviorSubject<ProjectAssignment[]> = new BehaviorSubject<ProjectAssignment[]>([]);
  dialogData: any;

  constructor(private httpClient: HttpCommonService) {
    this.httpClient.get('Project/GetProjects').subscribe((data: any) => {
      this.projects = data;
    },
      (error: HttpErrorResponse) => {
        console.log(error.name + ' ' + error.message);
      });
    this.httpClient.get('Employee/GetEmployee').subscribe((data: any) => {
      this.employees = data;
    },
      (error: HttpErrorResponse) => {
        console.log(error.name + ' ' + error.message);
      });

  }

  get data(): ProjectAssignment[] {
    return this.dataChange.value;
  }

  getDialogData() {
    return this.dialogData;
  }

  getAllProjectAssignments(): void {
    this.httpClient.get('ProjectAssignment/GetProjectAssignment').subscribe((data: any) => {
      this.dataChange.next(data);
    },
      (error: HttpErrorResponse) => {
        console.log(error.name + ' ' + error.message);
      });
  }

  getAllProjectAssignmentTreeData() {
    return this.httpClient.get('ProjectAssignment/GetProjectEmpTree');
  }
  getProjectAssignmentTreeSummaryData() {
    return this.httpClient.get('ProjectAssignment/GetProjectEmpTreeSummary');
  }
  getProjectCountData() {
    return this.httpClient.get('ProjectAssignment/GetProjectCount');
  }
  getEmployeeCountData() {
    return this.httpClient.get('ProjectAssignment/GetEmployeeCount');
  }

  addProjectAssignment(ProjectAssignment: ProjectAssignment): void {
    this.dialogData = ProjectAssignment;
    let p = this.getProjects().filter(x => x.id === ProjectAssignment.projectId)[0]
    ProjectAssignment.projectName = p.projectName;
    let e = this.getEmployees().filter(x => x.id === ProjectAssignment.employeeId)[0]
    ProjectAssignment.employeeName = e.firstName + " " + e.lastName;
    this.httpClient.post('ProjectAssignment/InsertProjectAssignment', ProjectAssignment).subscribe((data: any) => {
    },
      (error: HttpErrorResponse) => {
        console.log(error.name + ' ' + error.message);
      });
  }

  updateProjectAssignment(ProjectAssignment: ProjectAssignment): void {
    this.dialogData = ProjectAssignment;
    let p = this.getProjects().filter(x => x.id === ProjectAssignment.projectId)[0]
    ProjectAssignment.projectName = p.projectName;
    let e = this.getEmployees().filter(x => x.id === ProjectAssignment.employeeId)[0]
    ProjectAssignment.employeeName = e.firstName + " " + e.lastName;

    this.httpClient.put('ProjectAssignment/UpdateProjectAssignment', ProjectAssignment).subscribe((data: any) => {
    },
      (error: HttpErrorResponse) => {
        console.log(error.name + ' ' + error.message);
      });
  }

  deleteProjectAssignment(id: number): void {
    this.httpClient.delete('ProjectAssignment/DeleteProjectAssignment/' + id).subscribe((data: any) => {
    },
      (error: HttpErrorResponse) => {
        console.log(error.name + ' ' + error.message);
      });
  }

  getProjects() {
    return this.projects
  }
  getEmployees() {
    return this.employees
  }
}



