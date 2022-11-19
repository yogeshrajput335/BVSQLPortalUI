import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {Holiday} from '../models/Holiday';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import { HttpCommonService } from 'src/app/core/services/httpCommon.service';

@Injectable()
export class HolidayDataService {
  statuses = ['ACTIVE', 'INACTIVE']
  dataChange: BehaviorSubject<Holiday[]> = new BehaviorSubject<Holiday[]>([]);
  // Temporarily stores data from dialogs
  dialogData: any;

  constructor (private httpClient: HttpCommonService) {}

  get data(): Holiday[] {
    return this.dataChange.value;
  }

  getDialogData() {
    return this.dialogData;
  }

  /** CRUD METHODS */
  getAllHolidays(): void {
    this.httpClient.get('HolidayMaster/GetHolidayMaster').subscribe((data:any) => {
        this.dataChange.next(data);
      },
      (error: HttpErrorResponse) => {
      console.log (error.name + ' ' + error.message);
      });
  }

  // DEMO ONLY, you can find working methods below
  addHoliday (leaveType: Holiday): void {
    this.dialogData = leaveType;
    this.httpClient.post('HolidayMaster/InsertHolidayMaster',leaveType).subscribe((data:any) => {
      //this.dataChange.next(data);
    },
    (error: HttpErrorResponse) => {
    console.log (error.name + ' ' + error.message);
    });
  }

  updateHoliday (leaveType: Holiday): void {
    this.dialogData = leaveType;
    this.httpClient.put('HolidayMaster/UpdateHolidayMaster',leaveType).subscribe((data:any) => {
      //this.dataChange.next(data);
    },
    (error: HttpErrorResponse) => {
    console.log (error.name + ' ' + error.message);
    });
  }

  deleteHoliday (id: number): void {
    this.httpClient.delete('HolidayMaster/DeleteHolidayMaster/'+id).subscribe((data:any) => {
      //this.dataChange.next(data);
    },
    (error: HttpErrorResponse) => {
    console.log (error.name + ' ' + error.message);
    });
  }

  getStatues(){
    return this.statuses
  }
}



