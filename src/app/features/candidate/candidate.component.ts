import { Candidate } from './models/Candidate';
import { HttpCommonService } from './../../core/services/httpCommon.service';
import { Component, ElementRef, OnInit,TemplateRef, ViewChild } from '@angular/core';
import { CandidateDataService } from './services/candidate-data.service';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { DataSource } from '@angular/cdk/collections';
import { AddCandidateDialogComponent } from './dialogs/add/add-candidate.dialog.component';
import { EditCandidateDialogComponent } from './dialogs/edit/edit-candidate.dialog.component';
import { DeleteCandidateDialogComponent } from './dialogs/delete/delete-candidate.dialog.component';
import { BehaviorSubject, fromEvent, merge, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CandidateDataSource } from './candidate-datasource';
import { Store } from '@ngrx/store';
import { increment } from 'src/app/core/store/counter.actions';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-candidate',
  templateUrl: './candidate.component.html',
  styleUrls: ['./candidate.component.scss']
})
export class CandidateComponent implements OnInit {
  fileName= 'Candidate';
  displayedColumns = ['createdDate','name', 'technology', 'visa', 'rate','client','clientContact','clientMail','vendor','vendorContact','vendorMail', 'status', 'referByName', 'actions'];
  CandidateDatabase?: CandidateDataService | null;
  dataSource?: CandidateDataSource | null;
  index?: number;
  id?: number;

  constructor(
    public httpClient: HttpCommonService,
    public dialog: MatDialog,
    public dataService: CandidateDataService,
    private bottomSheet: MatBottomSheet,
    private store: Store) {
      this.store.dispatch(increment({message:"Candidate"}));
     }

  @ViewChild(MatPaginator, { static: true }) paginator?: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort?: MatSort;
  @ViewChild('filter', { static: true }) filter?: ElementRef;
  @ViewChild('templateBottomSheet') TemplateBottomSheet: TemplateRef<any> | undefined;

  ngOnInit() {
    this.loadData();
    this.loadSearchHistory();
  }

  refresh() {
    this.loadData();
  }

  addNew() {
    const dialogRef = this.dialog.open(AddCandidateDialogComponent, {
      data: { user: Candidate }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 1) {
        this.CandidateDatabase!.dataChange.value.push(this.dataService.getDialogData());
        this.refreshTable();
      }
    });
  }

  startEdit(i: number, id: number, createdDate: Date,name:string, technology: string, visa: string, rate: string, client: string, clientContact: string, ClientMail: string, vendor: string, vendorContact: string, vendorMail: string, status: string) {
    this.id = id;
    this.index = i;
    const dialogRef = this.dialog.open(EditCandidateDialogComponent, {
      data: { id: id, createdDate:createdDate,name:name, technology:technology, visa:visa, rate:rate, client:client, clientContact:clientContact, ClientMail:ClientMail, vendor:vendor, vendorContact:vendorContact, vendorMail:vendorMail, status: status }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 1) {
        const foundIndex = this.CandidateDatabase!.dataChange.value.findIndex(x => x.id === this.id);
        this.CandidateDatabase!.dataChange.value[foundIndex] = this.dataService.getDialogData();
        this.refreshTable();
      }
    });
  }

  deleteItem(i: number, id: number, firstName: string, lastName: string) {
    this.index = i;
    this.id = id;
    const dialogRef = this.dialog.open(DeleteCandidateDialogComponent, {
      data: { id: id, firstName:firstName, lastName:lastName }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 1) {
        const foundIndex = this.CandidateDatabase!.dataChange.value.findIndex(x => x.id === this.id);
        this.CandidateDatabase!.dataChange.value.splice(foundIndex, 1);
        this.refreshTable();
      }
    });
  }

  private refreshTable() {
    this.paginator!._changePageSize(this.paginator!.pageSize);
  }

  public loadData() {
    this.CandidateDatabase = new CandidateDataService(this.httpClient);
    this.dataSource = new CandidateDataSource(this.CandidateDatabase, this.paginator!, this.sort!);
    fromEvent(this.filter!.nativeElement, 'keyup')
      .subscribe(() => {
        if (!this.dataSource) {
          return;
        }
        this.dataSource.filter = this.filter!.nativeElement.value;
      });
  }

  public openSearchFilter(){
		if(this.TemplateBottomSheet)
		this.bottomSheet.open(this.TemplateBottomSheet);
	  }
	  public closeSearchFilter(){
		this.bottomSheet.dismiss();
	  }
	  searchHistory:string[] =[]
	  public onSearchFilter(data:any){
		if(data.trim() != ""){
		  this.searchHistory =[]
		  this.loadSearchHistory()
		  if(!this.searchHistory.includes(data)){
			this.searchHistory.push(data);
		  } else {
			this.searchHistory = this.searchHistory.filter(i => i !== data)
			this.searchHistory.push(data);
		  }
		  localStorage.setItem("candidate-search", JSON.stringify(this.searchHistory));
		}
		if (!this.dataSource) {
		  return;
		}
		this.dataSource.filter = data;
		this.bottomSheet.dismiss();
	  }
	  public loadSearchHistory(){
		if (localStorage.getItem("candidate-search") != null) {
		  this.searchHistory =  JSON.parse(localStorage.getItem("candidate-search")!.toString());
		}
	  }
	  public onClearSearchHistory(){
		localStorage.removeItem("candidate-search")
		this.searchHistory=[]
	  }

    exportexcel(): void
  {
    if(this.CandidateDatabase && this.CandidateDatabase.data){
    const ws: XLSX.WorkSheet =XLSX.utils.json_to_sheet(this.CandidateDatabase.data);

    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, this.fileName + 'Data');

    XLSX.writeFile(wb, this.fileName+(new Date()).toUTCString()+".xlsx");
    } else {
      alert('Error on export to excel.')
    }
}
}
