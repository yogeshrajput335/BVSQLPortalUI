import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { GoogleChartInterface, GoogleChartType } from 'ng2-google-charts';
import { HttpCommonService } from 'src/app/core/services/httpCommon.service';
import { HttpErrorResponse } from '@angular/common/http';
import * as d3 from 'd3';
import { Store } from '@ngrx/store';
import { increment } from 'src/app/core/store/counter.actions';
import { Observable } from 'rxjs';
import { VisitsChartData } from './models/visits-chart-data';
import { DashboardService } from './services/dashboard.service';
import { PerformanceChartData } from './models/performance-chart-data';
import { RevenueChartData } from './models/revenue-chart-data';
import { ServerChartData } from './models/server-chart-data';
import { ProjectStatData } from './models/project-stat-data';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  public visitsChartData$: Observable<VisitsChartData>;
  public performanceChartData$: Observable<PerformanceChartData>;
  public revenueChartData$: Observable<RevenueChartData>;
  public serverChartData$: Observable<ServerChartData>;
  public projectsStatsData$: Observable<ProjectStatData>;
  ngOnInit(): void {
  }

  constructor(private breakpointObserver: BreakpointObserver, private httpClient: HttpCommonService,
    private store: Store,private service: DashboardService) {
      this.store.dispatch(increment({message:"Dashboard"}));
      this.visitsChartData$ = this.service.loadVisitsChartData();
      this.performanceChartData$ = this.service.loadPerformanceChartData();
      this.revenueChartData$ = this.service.loadRevenueChartData();
      this.serverChartData$ = this.service.loadServerChartData();
      this.projectsStatsData$ = this.service.loadProjectsStatsData();
  }

}
