import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { GoogleChartInterface, GoogleChartType } from 'ng2-google-charts';
import { HttpCommonService } from 'src/app/core/services/httpCommon.service';
import { HttpErrorResponse } from '@angular/common/http';
import * as d3 from 'd3';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit{
  /** Based on the screen size, switch from standard to one column per row */
  cards = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
    map(({ matches }) => {
      if (matches) {
        return [
          { title: 'Card 1', cols: 1, rows: 1 },
          { title: 'Card 2', cols: 1, rows: 1 },
          { title: 'Card 3', cols: 1, rows: 1 },
          { title: 'Card 4', cols: 1, rows: 1 }
        ];
      }

      return [
        { title: 'Card 1', cols: 2, rows: 1 },
        { title: 'Card 2', cols: 1, rows: 1 },
        { title: 'Card 3', cols: 1, rows: 2 },
        { title: 'Card 4', cols: 1, rows: 1 }
      ];
    })
  );

  ngOnInit(): void {
    this.createSvg();
    this.drawBars(this.data);
}

  // public pieChart: GoogleChartInterface = {
  //   chartType: GoogleChartType.PieChart,
  //   dataTable: [],
  //   // [
  //   //   ['Task', 'Hours per Day'],
  //   //   ['Work',     11],
  //   //   ['Eat',      2],
  //   //   ['Commute',  2],
  //   //   ['Watch TV', 2],
  //   //   ['Sleep',    7]
  //   // ],
  //   //firstRowIsData: true,
  //   options: {'title': 'Tasks'},
  // };

  // public tableChart: GoogleChartInterface = {
  //   chartType: 'Table',
  //   dataTable: [
  //     ['Name',   'Manager', 'Tooltip'],
  //     [{v: 'Gajendra', f: 'Gajendra<div style="color:red; font-style:italic">Manager</div>'}, '', 'The President'],
  //     [{v: 'Rohit', f: 'Rohit<div style="color:red; font-style:italic">Team Lead</div>'}, 'Gajendra', 'VP'],
  //     [{v:'Suchit', f: 'Suchit<div style="color:red; font-style:italic">Sr. Engineer</div>'}, 'Rohit', 'SE'],
  //     [{v:'Ajay', f: 'Suchit<div style="color:red; font-style:italic">Sr. Engineer</div>'}, 'Rohit', 'SE'],
  //     [{v:'Ishan', f: 'Ishan<div style="color:red; font-style:italic">Engineer</div>'}, 'Ajay', 'JE']
  //   ],
  //   options: {
  //     allowHtml: true,
  //     allowCollapse: true
  //   }
  // };

  // public barChart: GoogleChartInterface = {
  //   chartType: GoogleChartType.BarChart,
  //   dataTable: [
  //     ['Name', 'Working Hours per Week'],
  //     ['Gajendra',     60],
  //     ['Rohit',      55],
  //     ['Suchit',  47],
  //     ['Ajay', 66],
  //     ['Ishan',    49]
  //   ],
  //   //firstRowIsData: true,
  //   options: {'title': 'Tasks'},
  // };
  // public histogram: GoogleChartInterface = {
  //   chartType: GoogleChartType.Histogram,
  //   dataTable: [
  //     ['Name', 'Working Hours per Week'],
  //     ['Gajendra',     60],
  //     ['Rohit',      55],
  //     ['Suchit',  47],
  //     ['Ajay', 66],
  //     ['Ishan',    49]
  //   ],
  //   //firstRowIsData: true,
  //   options :{legend:'none'},
  // };
  //pieChartData=[]
  constructor(private breakpointObserver: BreakpointObserver, private httpClient: HttpCommonService) {
      // this.httpClient.get('Dashboard/GetPieData').subscribe((data:any) => {
      //     //this.pieChartData = data;
      //     this.pieChart.dataTable = data;
      //   },
      //   (error: HttpErrorResponse) => {
      //     console.log (error.name + ' ' + error.message);
      // });

  }

  private data = [
    {"Framework": "Vue", "Stars": "166443", "Released": "2014"},
    {"Framework": "React", "Stars": "150793", "Released": "2013"},
    {"Framework": "Angular", "Stars": "62342", "Released": "2016"},
    {"Framework": "Backbone", "Stars": "27647", "Released": "2010"},
    {"Framework": "Ember", "Stars": "21471", "Released": "2011"},
  ];
  private svg:any;
  private margin = 50;
  private width = 350 - (this.margin * 2);
  private height = 250 - (this.margin * 2);

  private createSvg(): void {
    this.svg = d3.select("figure#bar")
    .append("svg")
    .attr("width", this.width + (this.margin * 2))
    .attr("height", this.height + (this.margin * 2))
    .append("g")
    .attr("transform", "translate(" + this.margin + "," + this.margin + ")");
}
private drawBars(data: any[]): void {
  // Create the X-axis band scale
  const x = d3.scaleBand()
  .range([0, this.width])
  .domain(data.map(d => d.Framework))
  .padding(0.2);

  // Draw the X-axis on the DOM
  this.svg.append("g")
  .attr("transform", "translate(0," + this.height + ")")
  .call(d3.axisBottom(x))
  .selectAll("text")
  .attr("transform", "translate(-10,0)rotate(-45)")
  .style("text-anchor", "end");

  // Create the Y-axis band scale
  const y = d3.scaleLinear()
  .domain([0, 200000])
  .range([this.height, 0]);

  // Draw the Y-axis on the DOM
  this.svg.append("g")
  .call(d3.axisLeft(y));

  // Create and fill the bars
  this.svg.selectAll("bars")
  .data(data)
  .enter()
  .append("rect")
  .attr("x", (d:any) => x(d.Framework))
  .attr("y", (d:any) => y(d.Stars))
  .attr("width", x.bandwidth())
  .attr("height", (d:any) => this.height - y(d.Stars))
  .attr("fill", "#d04a35");
}
}
