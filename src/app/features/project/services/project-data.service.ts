import { Client } from './../../client/models/Client';
import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {Project} from '../models/Project';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import { HttpCommonService } from 'src/app/core/services/httpCommon.service';

@Injectable()
export class ProjectDataService {
  statuses = ['NEW', 'APPROVED','REJECTED']
  projectTypes=['Type A', 'Type B','Type c'];
  clients=[{id:0,clientName:''}];
  dataChange: BehaviorSubject<Project[]> = new BehaviorSubject<Project[]>([]);
  // Temporarily stores data from dialogs
  dialogData: any;

  constructor (private httpClient: HttpCommonService) {
    this.httpClient.get('Client/GetClient').subscribe((data:any) => {
      this.clients = data;
    },
    (error: HttpErrorResponse) => {
    console.log (error.name + ' ' + error.message);
    });

  }

  get data(): Project[] {
    return this.dataChange.value;
  }

  getDialogData() {
    return this.dialogData;
  }

  /** CRUD METHODS */
  getAllProjects(): void {
    this.httpClient.get('Project/GetProjects').subscribe((data:any) => {
        this.dataChange.next(data);
      },
      (error: HttpErrorResponse) => {
      console.log (error.name + ' ' + error.message);
      });
  }

  // DEMO ONLY, you can find working methods below
  addProject (Project: Project): void {
    this.dialogData = Project;
    let e = this.getClients().filter(x=>x.id===Project.clientId)[0]
    Project.clientName = e.clientName;
    this.httpClient.post('Project/InsertProject',Project).subscribe((data:any) => {
      //this.dataChange.next(data);
    },
    (error: HttpErrorResponse) => {
    console.log (error.name + ' ' + error.message);
    });
  }

  updateProject (Project: Project): void {
    this.dialogData = Project;
    let e = this.getClients().filter(x=>x.id===Project.clientId)[0]
    Project.clientName = e.clientName;
    this.httpClient.put('Project/UpdateProject',Project).subscribe((data:any) => {
      //this.dataChange.next(data);
    },
    (error: HttpErrorResponse) => {
    console.log (error.name + ' ' + error.message);
    });
  }

  deleteProject (id: number): void {
    console.log(id);
    this.httpClient.delete('Project/DeleteProject/'+id).subscribe((data:any) => {
      //this.dataChange.next(data);
    },
    (error: HttpErrorResponse) => {
    console.log (error.name + ' ' + error.message);
    });
  }

  getStatues(){
    return this.statuses
  }
  getClients(){
    return this.clients
  }
  getProjectTypes(){
    return this.projectTypes
  }
}



