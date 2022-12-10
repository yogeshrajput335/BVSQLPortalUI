import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Candidate } from '../models/Candidate';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { HttpCommonService } from 'src/app/core/services/httpCommon.service';

@Injectable()
export class CandidateDataService {
  statuses = ['ACTIVE', 'INACTIVE', 'REFERRED']

  dataChange: BehaviorSubject<Candidate[]> = new BehaviorSubject<Candidate[]>([]);
  dialogData: any;

  constructor(private httpClient: HttpCommonService) { }

  get data(): Candidate[] {
    return this.dataChange.value;
  }

  getDialogData() {
    return this.dialogData;
  }

  getAllCandidate(): void {
    this.httpClient.get('Candidate/GetCandidates').subscribe((data: any) => {
      this.dataChange.next(data);
    },
      (error: HttpErrorResponse) => {
        console.log(error.name + ' ' + error.message);
      });
  }

  addCandidate(candidate: Candidate): void {
    this.dialogData = candidate;
    this.httpClient.post('Candidate/InsertCandidate', candidate).subscribe((data: any) => {
    },
      (error: HttpErrorResponse) => {
        console.log(error.name + ' ' + error.message);
      });
  }

  updateCandidate(candidate: Candidate): void {
    this.dialogData = candidate;
    this.httpClient.put('Candidate/UpdateCandidate', candidate).subscribe((data: any) => {
    },
      (error: HttpErrorResponse) => {
        console.log(error.name + ' ' + error.message);
      });
  }

  deleteCandidate(id: number): void {
    this.httpClient.delete('Candidate/DeleteCandidate/' + id).subscribe((data: any) => {
    },
      (error: HttpErrorResponse) => {
        console.log(error.name + ' ' + error.message);
      });
  }

  getStatues() {
    return this.statuses
  }
}





