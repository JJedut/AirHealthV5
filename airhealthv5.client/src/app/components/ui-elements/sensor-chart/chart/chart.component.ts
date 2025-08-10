import {Component, Input, OnInit} from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';
import {ChartData} from "../../../../models/DTO/chartData";
import {FormatKeyToTitle} from "../../../../utils/FormatKeyToTitle";

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss', './chart.less'],
  animations: [
    trigger('fadeSlide', [
      state('visible', style({ opacity: 1, transform: 'translateY(0)' })),
      state('hidden', style({ opacity: 0, transform: 'translateY(-10px)' })),
      transition('visible <=> hidden', [animate('0.3s ease-in-out')]),
    ]),
  ],
})
export class ChartComponent implements OnInit {
  protected readonly stringify = String;
  @Input() data!: ChartData;
  @Input() fromDateNum: Date = new Date();
  @Input() axisXLabels: string[] = [];
  isVisible: boolean = true;
  width: number = 0;

  ngOnInit() {
    console.log(this.data.value)
  }

  toggleVisibility(): void {
    this.isVisible = !this.isVisible;
  }

  protected getUnitStringify(unit: string): (value: number) => string {
    return (value: number) => `${value} ${unit}`;
  }

  protected readonly dateStringify = (x: number): string => {
    const transformedValue = x * 1000;

    const date = new Date(this.fromDateNum.getTime() + transformedValue);

    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();

    return `${hours}:${minutes} ${day}.${month}.${year}`;
  };
  protected readonly FormatKeyToTitle = FormatKeyToTitle;
}
