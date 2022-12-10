import { ProjectAssignment } from './models/ProjectAssignment';
import { HttpCommonService } from './../../core/services/httpCommon.service';
import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ProjectAssignmentDataService } from './services/project-assignment-data.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { DataSource } from '@angular/cdk/collections';
import { DeleteProjectAssignmentDialogComponent } from './dialogs/delete/delete-project-assignment.dialog.component';
import { BehaviorSubject, fromEvent, merge, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ProjectAssignmentDataSource } from './project-assignment-datasource';
import { AddProjectAssignmentDialogComponent } from './dialogs/add/add-project-assignmnet.dialog.component';
import { EditProjectAssignmentDialogComponent } from './dialogs/edit/edit-project-assignment.dialog.component';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { Store } from '@ngrx/store';
import { increment } from 'src/app/core/store/counter.actions';
import * as XLSX from 'xlsx';

interface ProjectEmpTree {
  name: string;
  children?: ProjectEmpTree[];
}

interface ExampleFlatNode {
  expandable: boolean;
  name: string;
  level: number;
}
@Component({
  selector: 'app-project-assignment',
  templateUrl: './project-assignment.component.html',
  styleUrls: ['./project-assignment.component.scss']
})
export class ProjectAssignmentComponent implements OnInit {
  fileName = 'ProjectAssignment';
  displayedColumns = ['projectName', 'employeeName', 'notes', 'startDate', 'endDate', 'actions'];
  ProjectAssignmentDatabase?: ProjectAssignmentDataService | null;
  dataSource?: ProjectAssignmentDataSource | null;
  index?: number;
  id?: number;
  summaryData: any = {
    'activeClientCount': 0, "inactiveClientCount": 0, "totalClientCount": 0, "projectEmpCount": [],
    'newProjectsCount': 0, 'approvedProjectsCount': 0, 'rejectedProjectsCount': 0,
    "activeEmployeeCount": 0, "inactiveEmployeeCount": 0, "clientEmpCount": [], "clientProjectCount": [],
  };
  constructor(public httpClient: HttpCommonService,
    public dialog: MatDialog,
    public dataService: ProjectAssignmentDataService,
    private bottomSheet: MatBottomSheet,
    private store: Store) {
    this.store.dispatch(increment({ message: "Project Assignment" }));
    this.dataService.getAllProjectAssignmentTreeData().subscribe((data: any) => {
      this.treeDataSource.data = data;
    },
      (error: HttpErrorResponse) => {
        console.log(error.name + ' ' + error.message);
      });
    this.dataService.getProjectAssignmentTreeSummaryData().subscribe((data: any) => {
      this.summaryData = data;
    },
      (error: HttpErrorResponse) => {
        console.log(error.name + ' ' + error.message);
      });
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
    const dialogRef = this.dialog.open(AddProjectAssignmentDialogComponent, {
      data: { user: ProjectAssignment }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 1) {
        this.ProjectAssignmentDatabase!.dataChange.value.push(this.dataService.getDialogData());
        this.refreshTable();
      }
    });
  }

  startEdit(i: number, id: number, projectId: number, employeeId: number, notes: string, startDate: Date, endDate: Date) {
    this.id = id;
    this.index = i;
    const dialogRef = this.dialog.open(EditProjectAssignmentDialogComponent, {
      data: { id: id, projectId: projectId, employeeId: employeeId, notes: notes, startDate: startDate, endDate: endDate }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 1) {
        const foundIndex = this.ProjectAssignmentDatabase!.dataChange.value.findIndex(x => x.id === this.id);
        this.ProjectAssignmentDatabase!.dataChange.value[foundIndex] = this.dataService.getDialogData();
        this.refreshTable();
      }
    });
  }

  deleteItem(i: number, id: number, projectId: number) {
    this.index = i;
    this.id = id;
    const dialogRef = this.dialog.open(DeleteProjectAssignmentDialogComponent, {
      data: { id: id, projectId: projectId }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 1) {
        const foundIndex = this.ProjectAssignmentDatabase!.dataChange.value.findIndex(x => x.id === this.id);
        this.ProjectAssignmentDatabase!.dataChange.value.splice(foundIndex, 1);
        this.refreshTable();
      }
    });
  }


  private refreshTable() {
    this.paginator!._changePageSize(this.paginator!.pageSize);
  }

  public loadData() {
    this.ProjectAssignmentDatabase = new ProjectAssignmentDataService(this.httpClient);
    this.dataSource = new ProjectAssignmentDataSource(this.ProjectAssignmentDatabase, this.paginator!, this.sort!);
    fromEvent(this.filter!.nativeElement, 'keyup')
      .subscribe(() => {
        if (!this.dataSource) {
          return;
        }
        this.dataSource.filter = this.filter!.nativeElement.value;
      });
  }

  exportexcel(): void {
    if (this.ProjectAssignmentDatabase && this.ProjectAssignmentDatabase.data) {
      const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.ProjectAssignmentDatabase.data);

      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, this.fileName + 'Data');

      XLSX.writeFile(wb, this.fileName + (new Date()).toUTCString() + ".xlsx");
    } else {
      alert('Error on export to excel.')
    }
  }

  public openSearchFilter() {
    if (this.TemplateBottomSheet)
      this.bottomSheet.open(this.TemplateBottomSheet);
  }
  public closeSearchFilter() {
    this.bottomSheet.dismiss();
  }
  searchHistory: string[] = []
  public onSearchFilter(data: any) {
    if (data.trim() != "") {
      this.searchHistory = []
      this.loadSearchHistory()
      if (!this.searchHistory.includes(data)) {
        this.searchHistory.push(data);
      } else {
        this.searchHistory = this.searchHistory.filter(i => i !== data)
        this.searchHistory.push(data);
      }
      localStorage.setItem("project-assignment-search", JSON.stringify(this.searchHistory));
    }
    if (!this.dataSource) {
      return;
    }
    this.dataSource.filter = data;
    this.bottomSheet.dismiss();
  }
  public loadSearchHistory() {
    if (localStorage.getItem("project-assignment-search") != null) {
      this.searchHistory = JSON.parse(localStorage.getItem("project-assignment-search")!.toString());
    }
  }
  public onClearSearchHistory() {
    localStorage.removeItem("project-assignment-search")
    this.searchHistory = []
  }

  private _transformer = (node: ProjectEmpTree, level: number) => {
    return {
      expandable: !!node.children && node.children.length > 0,
      name: node.name,
      level: level,
    };
  };

  treeControl = new FlatTreeControl<ExampleFlatNode>(
    node => node.level,
    node => node.expandable,
  );

  treeFlattener = new MatTreeFlattener(
    this._transformer,
    node => node.level,
    node => node.expandable,
    node => node.children,
  );

  treeDataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

  hasChild = (_: number, node: ExampleFlatNode) => node.expandable;
}


