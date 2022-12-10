import { Component, Input } from '@angular/core';
import { of } from 'rxjs';


import { colors } from '../../../../consts';
import { VisitsChartData } from '../../models/visits-chart-data';

@Component({
  selector: 'app-visits-chart',
  templateUrl: './visits-chart.component.html',
  styleUrls: ['./visits-chart.component.scss']
})
export class VisitsChartComponent {
  @Input() visitsChartData: any;//VisitsChartData;
  public colors: typeof colors = colors;
}
