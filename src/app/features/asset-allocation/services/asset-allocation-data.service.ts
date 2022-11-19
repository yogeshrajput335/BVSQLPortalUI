import { EmployeeDataService } from './../../employee/services/employee-data.service';
import { AssetAllocation } from './../models/AssetAllocation';
import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import { HttpCommonService } from 'src/app/core/services/httpCommon.service';

@Injectable()
export class AssetAllocationDataService {
  statuses = ['ALLOCATED', 'RETURNED']
  assets=[{id:0,name:''}];// = ['ADMIN', 'EMPLOYEE']
  employees=[{id:0,firstName:'',lastName:''}];

  dataChange: BehaviorSubject<AssetAllocation[]> = new BehaviorSubject<AssetAllocation[]>([]);
  // Temporarily stores data from dialogs
  dialogData: any;

  constructor (private httpClient: HttpCommonService) {

    this.httpClient.get('Asset/GetAsset').subscribe((data:any) => {
      this.assets = data;
    },
    (error: HttpErrorResponse) => {
    console.log (error.name + ' ' + error.message);
    });

    this.httpClient.get('Employee/GetEmployee').subscribe((data:any) => {
      this.employees = data;
    },
    (error: HttpErrorResponse) => {
    console.log (error.name + ' ' + error.message);
    });
  }

  get data(): AssetAllocation[] {
    return this.dataChange.value;
  }

  getDialogData() {
    return this.dialogData;
  }

  /** CRUD METHODS */
  getAllAssetAllocation(): void {
    this.httpClient.get('AssetAllocation/GetAssetAllocation').subscribe((data:any) => {
        this.dataChange.next(data);
      },
      (error: HttpErrorResponse) => {
      console.log (error.name + ' ' + error.message);
      });

  }

  // DEMO ONLY, you can find working methods below
  addAssetAllocation (user: AssetAllocation): void {
    user.assetName = this.getAssets().filter(x=>x.id===user.assetId)[0].name;
    let at = this.getEmployees().filter(x=>x.id===user.allocatedToId)[0];
    let ab = this.getEmployees().filter(x=>x.id===user.allocatedById)[0];
    user.allocatedTo = at.firstName + ' '+at.lastName;
    user.allocatedBy = ab.firstName + ' '+ab.lastName;
    this.dialogData = user;
    this.httpClient.post('AssetAllocation/InsertAssetAllocation',user).subscribe((data:any) => {
      //this.dataChange.next(data);
    },
    (error: HttpErrorResponse) => {
    console.log (error.name + ' ' + error.message);
    });
  }

  updateAssetAllocation (user: AssetAllocation): void {
    user.assetName = this.getAssets().filter(x=>x.id===user.assetId)[0].name;
    let at = this.getEmployees().filter(x=>x.id===user.allocatedToId)[0];
    let ab = this.getEmployees().filter(x=>x.id===user.allocatedById)[0];
    user.allocatedTo = at.firstName + ' '+at.lastName;
    user.allocatedBy = ab.firstName + ' '+ab.lastName;
    this.dialogData = user;
    this.httpClient.put('AssetAllocation/UpdateAssetAllocation',user).subscribe((data:any) => {
      //this.dataChange.next(data);
    },
    (error: HttpErrorResponse) => {
    console.log (error.name + ' ' + error.message);
    });
  }

  deleteAssetAllocation (id: number): void {
    this.httpClient.delete('AssetAllocation/DeleteAssetAllocation/'+id).subscribe((data:any) => {
      //this.dataChange.next(data);
    },
    (error: HttpErrorResponse) => {
    console.log (error.name + ' ' + error.message);
    });
  }

  getStatues(){
    return this.statuses
  }
  getAssets(){
    return this.assets
  }
  getEmployees(){
    return this.employees
  }
}
