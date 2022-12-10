import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Asset } from '../models/Asset';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { HttpCommonService } from 'src/app/core/services/httpCommon.service';

@Injectable()
export class AssetDataService {
  statuses = ['ACTIVE', 'INACTIVE']
  assetTypes = [{ id: 0, name: '' }];// = ['ADMIN', 'EMPLOYEE']

  dataChange: BehaviorSubject<Asset[]> = new BehaviorSubject<Asset[]>([]);
  dialogData: any;

  constructor(private httpClient: HttpCommonService) {

    this.httpClient.get('AssetType/GetAssetType').subscribe((data: any) => {
      this.assetTypes = data;
    },
      (error: HttpErrorResponse) => {
        console.log(error.name + ' ' + error.message);
      });
  }

  get data(): Asset[] {
    return this.dataChange.value;
  }

  getDialogData() {
    return this.dialogData;
  }

  getAllAsset(): void {
    this.httpClient.get('Asset/GetAsset').subscribe((data: any) => {
      this.dataChange.next(data);
    },
      (error: HttpErrorResponse) => {
        console.log(error.name + ' ' + error.message);
      });

  }

  addAsset(user: Asset): void {
    user.type = this.getAssetTypes().filter(x => x.id === user.typeId)[0].name;
    this.dialogData = user;
    this.httpClient.post('Asset/InsertAsset', user).subscribe((data: any) => {
    },
      (error: HttpErrorResponse) => {
        console.log(error.name + ' ' + error.message);
      });
  }

  updateAsset(user: Asset): void {
    user.type = this.getAssetTypes().filter(x => x.id === user.typeId)[0].name;
    this.dialogData = user;
    this.httpClient.put('Asset/UpdateAsset', user).subscribe((data: any) => {
    },
      (error: HttpErrorResponse) => {
        console.log(error.name + ' ' + error.message);
      });
  }

  deleteAsset(id: number): void {
    this.httpClient.delete('Asset/DeleteAsset/' + id).subscribe((data: any) => {
    },
      (error: HttpErrorResponse) => {
        console.log(error.name + ' ' + error.message);
      });
  }

  getStatues() {
    return this.statuses
  }
  getAssetTypes() {
    return this.assetTypes
  }
}
