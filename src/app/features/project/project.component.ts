import { Project } from './models/Project';
import { HttpCommonService } from './../../core/services/httpCommon.service';
import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ProjectDataService} from './services/project-data.service';
import {HttpClient} from '@angular/common/http';
import {MatDialog} from '@angular/material/dialog';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {DataSource} from '@angular/cdk/collections';
import {AddProjectDialogComponent} from './dialogs/add/add-project.dialog.component';
import {EditProjectDialogComponent} from './dialogs/edit/edit-project.dialog.component';
import {DeleteProjectDialogComponent} from './dialogs/delete/delete-project.dialog.component';
import {BehaviorSubject, fromEvent, merge, Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import { ProjectDataSource } from './project-datasource';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss']
})
export class ProjectComponent implements OnInit {
  displayedColumns = ['projectName', 'clientName', 'description', 'startDate', 'endDate', 'projectType', 'status', 'actions'];
 ProjectDatabase?: ProjectDataService | null;
  dataSource?: ProjectDataSource | null;
  index?: number;
  id?: number;


  constructor(public httpClient: HttpCommonService,
    public dialog: MatDialog,
    public dataService: ProjectDataService) { }

  @ViewChild(MatPaginator, {static: true}) paginator?: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort?: MatSort;
  @ViewChild('filter',  {static: true}) filter?: ElementRef;

  ngOnInit() {
    this.loadData();
  }

  refresh() {
    this.loadData();
  }

  addNew() {
    const dialogRef = this.dialog.open(AddProjectDialogComponent, {
      data: {user:  Project }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 1) {
        this.ProjectDatabase!.dataChange.value.push(this.dataService.getDialogData());
        this.refreshTable();
      }
    });
  }

  startEdit(i: number, id: number, projectName : string, clientId: number, description:string, startDate: Date, endDate:Date, projectType :string, status: string) {
    this.id = id;
    this.index = i;
    console.log(this.index);
    const dialogRef = this.dialog.open(EditProjectDialogComponent, {
      data: {id: id, projectName: projectName, clientId: clientId, description: description, startDate: startDate, endDate: endDate, projectType: projectType, status: status}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 1) {
        const foundIndex = this.ProjectDatabase!.dataChange.value.findIndex(x => x.id === this.id);
        this.ProjectDatabase!.dataChange.value[foundIndex] = this.dataService.getDialogData();
        this.refreshTable();
      }
    });
  }

  deleteItem(i: number, id: number, projectName: string) {
    this.index = i;
    this.id = id;
    const dialogRef = this.dialog.open(DeleteProjectDialogComponent, {
      data: {id: id, projectName: projectName}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 1) {
        const foundIndex = this.ProjectDatabase!.dataChange.value.findIndex(x => x.id === this.id);
        this.ProjectDatabase!.dataChange.value.splice(foundIndex, 1);
        this.refreshTable();
      }
    });
  }


  private refreshTable() {
    this.paginator!._changePageSize(this.paginator!.pageSize);
  }

  public loadData() {
    this.ProjectDatabase = new ProjectDataService(this.httpClient);
    this.dataSource = new ProjectDataSource(this.ProjectDatabase, this.paginator!, this.sort!);
    fromEvent(this.filter!.nativeElement, 'keyup')
      .subscribe(() => {
        if (!this.dataSource) {
          return;
        }
        this.dataSource.filter = this.filter!.nativeElement.value;
      });
  }
}


