import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrl: './chart.component.scss'
})
export class ChartComponent {
  protected readonly stringify = String;
  @Input() data: Readonly<[number, number]>[] = [];
  axisYLabels: string[] = [];
  width: number = 0;


}
