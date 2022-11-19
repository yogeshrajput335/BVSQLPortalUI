import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {Client} from '../models/Client';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import { HttpCommonService } from 'src/app/core/services/httpCommon.service';

@Injectable()
export class ClientDataService {
  statuses = ['ACTIVE', 'INACTIVE']
  projects:any;
  dataChange: BehaviorSubject<Client[]> = new BehaviorSubject<Client[]>([]);
  // Temporarily stores data from dialogs
  dialogData: any;

  constructor (private httpClient: HttpCommonService) {
    this.httpClient.get('Project/GetProjects').subscribe((data:any) => {
      this.projects = data;
    },
    (error: HttpErrorResponse) => {
    console.log (error.name + ' ' + error.message);
    });
  }

  get data(): Client[] {
    return this.dataChange.value;
  }

  getDialogData() {
    return this.dialogData;
  }

  /** CRUD METHODS */
  getAllClient(): void {
    this.httpClient.get('Client/GetClient').subscribe((data:any) => {
        this.dataChange.next(data);
      },
      (error: HttpErrorResponse) => {
      console.log (error.name + ' ' + error.message);
      });
  }

  // DEMO ONLY, you can find working methods below
  addClient (client: Client): void {
    this.dialogData = client;
    this.httpClient.post('Client/InsertClient',client).subscribe((data:any) => {
      //this.dataChange.next(data);
    },
    (error: HttpErrorResponse) => {
    console.log (error.name + ' ' + error.message);
    });
  }

  updateClient (client: Client): void {
    this.dialogData = client;
    this.httpClient.put('Client/UpdateClient',client).subscribe((data:any) => {
      //this.dataChange.next(data);
    },
    (error: HttpErrorResponse) => {
    console.log (error.name + ' ' + error.message);
    });
  }

  deleteClient (id: number): void {
    this.httpClient.delete('Client/DeleteClient/'+id).subscribe((data:any) => {
      //this.dataChange.next(data);
    },
    (error: HttpErrorResponse) => {
    console.log (error.name + ' ' + error.message);
    });
  }
  setTerm(id:number,term:number,reasonForChange:string, changeBy:number){
    this.httpClient.post('Client/SetTerm/'+id+'/'+term,
      {reasonForChange: reasonForChange, changeBy: changeBy}
    ).subscribe((data:any) => {
      //this.dataChange.next(data);
    },
    (error: HttpErrorResponse) => {
    console.log (error.name + ' ' + error.message);
    });
  }
  getStatues(){
    return this.statuses
  }
  getProjects(){
    return this.projects
  }
}



/* REAL LIFE CRUD Methods I've used in my projects. ToasterService uses Material Toasts for displaying messages:

    // ADD, POST METHOD
    addItem(kanbanItem: KanbanItem): void {
    this.httpClient.post(this.API_URL, kanbanItem).subscribe(data => {
      this.dialogData = kanbanItem;
      this.toasterService.showToaster('Successfully added', 3000);
      },
      (err: HttpErrorResponse) => {
      this.toasterService.showToaster('Error occurred. Details: ' + err.name + ' ' + err.message, 8000);
    });
   }

    // UPDATE, PUT METHOD
     updateItem(kanbanItem: KanbanItem): void {
    this.httpClient.put(this.API_URL + kanbanItem.id, kanbanItem).subscribe(data => {
        this.dialogData = kanbanItem;
        this.toasterService.showToaster('Successfully edited', 3000);
      },
      (err: HttpErrorResponse) => {
        this.toasterService.showToaster('Error occurred. Details: ' + err.name + ' ' + err.message, 8000);
      }
    );
  }

  // DELETE METHOD
  deleteItem(id: number): void {
    this.httpClient.delete(this.API_URL + id).subscribe(data => {
        this.toasterService.showToaster('Successfully deleted', 3000);
      },
      (err: HttpErrorResponse) => {
        this.toasterService.showToaster('Error occurred. Details: ' + err.name + ' ' + err.message, 8000);
      }
    );
  }
*/




