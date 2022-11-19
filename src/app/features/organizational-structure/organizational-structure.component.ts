import { Component, OnInit } from '@angular/core';
import {
  GoogleChartInterface
} from 'ng2-google-charts';

@Component({
  selector: 'app-organizational-structure',
  templateUrl: './organizational-structure.component.html',
  styleUrls: ['./organizational-structure.component.scss']
})
export class OrganizationalStructureComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  public orgChart: GoogleChartInterface = {
    chartType: 'OrgChart',
    dataTable: [
      ['Name',   'Manager', 'Tooltip'],
      [{v: 'Gajendra', f: 'Gajendra<div style="color:red; font-style:italic">Manager</div>'}, '', 'The President'],
      [{v: 'Rohit', f: 'Rohit<div style="color:red; font-style:italic">Team Lead</div>'}, 'Gajendra', 'VP'],
      [{v:'Suchit', f: 'Suchit<div style="color:red; font-style:italic">Sr. Engineer</div>'}, 'Rohit', 'SE'],
      [{v:'Ajay', f: 'Suchit<div style="color:red; font-style:italic">Sr. Engineer</div>'}, 'Rohit', 'SE'],
      [{v:'Ishan', f: 'Ishan<div style="color:red; font-style:italic">Engineer</div>'}, 'Ajay', 'JE']
    ],
    options: {
      allowHtml: true,
      allowCollapse: true
    }
  };
  public tableChart: GoogleChartInterface = {
    chartType: 'Table',
    dataTable: [
      ['Name',   'Manager', 'Tooltip'],
      [{v: 'Gajendra', f: 'Gajendra<div style="color:red; font-style:italic">Manager</div>'}, '', 'The President'],
      [{v: 'Rohit', f: 'Rohit<div style="color:red; font-style:italic">Team Lead</div>'}, 'Gajendra', 'VP'],
      [{v:'Suchit', f: 'Suchit<div style="color:red; font-style:italic">Sr. Engineer</div>'}, 'Rohit', 'SE'],
      [{v:'Ajay', f: 'Suchit<div style="color:red; font-style:italic">Sr. Engineer</div>'}, 'Rohit', 'SE'],
      [{v:'Ishan', f: 'Ishan<div style="color:red; font-style:italic">Engineer</div>'}, 'Ajay', 'JE']
    ],
    options: {
      allowHtml: true,
      allowCollapse: true
    }
  };
  public clientChart: GoogleChartInterface = {
    chartType: 'Table',
    dataTable: [
      ['Name',   'Manager', 'Tooltip'],
      [{v: 'Gajendra', f: 'Gajendra<div style="color:red; font-style:italic">Manager</div>'}, '', 'The President'],
      [{v: 'Rohit', f: 'Rohit<div style="color:red; font-style:italic">Team Lead</div>'}, 'Gajendra', 'VP'],
      [{v:'Suchit', f: 'Suchit<div style="color:red; font-style:italic">Sr. Engineer</div>'}, 'Rohit', 'SE'],
      [{v:'Ajay', f: 'Suchit<div style="color:red; font-style:italic">Sr. Engineer</div>'}, 'Rohit', 'SE'],
      [{v:'Ishan', f: 'Ishan<div style="color:red; font-style:italic">Engineer</div>'}, 'Ajay', 'JE']
    ],
    options: {
      allowHtml: true,
      allowCollapse: true
    }
  };

  //type = 'Table';
  //  data1 = [
  //     ['Mike',  {v: 10000, f: '$10,000'}, true],
  //     ['Jim',   {v:8000,   f: '$8,000'},  false],
  //     ['Alice', {v: 12500, f: '$12,500'}, true],
  //     ['Bob',   {v: 7000,  f: '$7,000'},  true]
  //  ];
  //  columnNames = ["Name", "Salary","Full Time Employee"];
  //  options = {
  //    alternatingRowStyle:true,
  //    showRowNumber:true
  //  };
  //  width = 550;
  //  height = 400;

}
