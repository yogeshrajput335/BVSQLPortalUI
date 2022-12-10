import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {Reference} from '../models/Reference';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import { HttpCommonService } from 'src/app/core/services/httpCommon.service';

@Injectable()
export class ReferenceDataService {
  statuses = ['ACTIVE', 'INACTIVE','Moved to candidate']


  dataChange: BehaviorSubject<Reference[]> = new BehaviorSubject<Reference[]>([]);
  dialogData: any;

  constructor (private httpClient: HttpCommonService) {}

  get data(): Reference[] {
    return this.dataChange.value;
  }

  getDialogData() {
    return this.dialogData;
  }

  getAllReference(): void {
    this.httpClient.get('ReferList/GetReferList').subscribe((data:any) => {
        this.dataChange.next(data);
      },
      (error: HttpErrorResponse) => {
      console.log (error.name + ' ' + error.message);
      });
  }

  addReference(user: Reference): void {
    this.dialogData = user;
    this.httpClient.post('ReferList/InsertReferList',user).subscribe((data:any) => {
    },
    (error: HttpErrorResponse) => {
    console.log (error.name + ' ' + error.message);
    });
  }

  updateReference(user: Reference): void {
    this.dialogData = user;
    this.httpClient.put('ReferList/UpdateReferList',user).subscribe((data:any) => {
    },
    (error: HttpErrorResponse) => {
    console.log (error.name + ' ' + error.message);
    });
  }

  deleteReference(id: number): void {
    this.httpClient.delete('ReferList/DeleteReferList/'+id).subscribe((data:any) => {
    },
    (error: HttpErrorResponse) => {
    console.log (error.name + ' ' + error.message);
    });
  }

  moveToCandidate(id: number, employeeId :number) {
    return this.httpClient.delete('ReferList/MoveToCandidate/'+id+'/'+employeeId);
  }

  getStatues(){
    return this.statuses
  }
 }