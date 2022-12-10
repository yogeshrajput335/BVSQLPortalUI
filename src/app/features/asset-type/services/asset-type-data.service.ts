import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AssetType } from '../models/AssetType';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { HttpCommonService } from 'src/app/core/services/httpCommon.service';

@Injectable()
export class AssetTypeDataService {
  statuses = ['ACTIVE', 'INACTIVE']

  dataChange: BehaviorSubject<AssetType[]> = new BehaviorSubject<AssetType[]>([]);
  dialogData: any;

  constructor(private httpClient: HttpCommonService) {
  }

  get data(): AssetType[] {
    return this.dataChange.value;
  }

  getDialogData() {
    return this.dialogData;
  }

  getAllAssetType(): void {
    this.httpClient.get('AssetType/GetAssetType').subscribe((data: any) => {
      this.dataChange.next(data);
    },
      (error: HttpErrorResponse) => {
        console.log(error.name + ' ' + error.message);
      });

  }

  addAssetType(user: AssetType): void {
    this.dialogData = user;
    this.httpClient.post('AssetType/InsertAssetType', user).subscribe((data: any) => {
    },
      (error: HttpErrorResponse) => {
        console.log(error.name + ' ' + error.message);
      });
  }

  updateAssetType(user: AssetType): void {
    this.dialogData = user;
    this.httpClient.put('AssetType/UpdateAssetType', user).subscribe((data: any) => {
    },
      (error: HttpErrorResponse) => {
        console.log(error.name + ' ' + error.message);
      });
  }

  deleteAssetType(id: number): void {
    this.httpClient.delete('AssetType/DeleteAssetType/' + id).subscribe((data: any) => {
    },
      (error: HttpErrorResponse) => {
        console.log(error.name + ' ' + error.message);
      });
  }

  getStatues() {
    return this.statuses
  }
}
