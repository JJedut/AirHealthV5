import {Component, Input, OnChanges, OnInit, signal, SimpleChanges} from '@angular/core';
import {SensorDataService} from "../../../services/sensor-data.service";
import {ChartData} from "../../../models/DTO/chartData";
import {TimeRange} from "../../../models/TimeRange";
import {ChartFormat} from "../../../models/ChartFormat";
import {convertChartFormatToChartData} from "../../../utils/chart-utils";

@Component({
  selector: 'app-sensor-chart',
  templateUrl: './sensor-chart.component.html',
  styleUrls: ['./sensor-chart.component.scss', './chart.less']
})
export class SensorChartComponent implements OnInit, OnChanges  {
  @Input() deviceId: string | null = null;

  isTableView: boolean = false;

  fromDateInput: string = '';
  toDateInput: string = '';
  fromDateNum: Date = new Date();
  toDateNum: Date = new Date();

  deviceChartData: ChartFormat | null = null;
  sensorsChartData: ChartData[] = [];


  timeRange = signal<TimeRange>({
    from: new Date(Date.now() - 24 * 60 * 60 * 1000),
    to: new Date()
  });

  constructor(private sensorDataService: SensorDataService) {}

  ngOnInit(): void {
    this.setDefaultDates();
    this.getChartData();
    this.sensorsChartData = this.convertChartData();
    console.log('this.sensorsChartData: ', this.sensorsChartData);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['deviceId'] && changes['deviceId'].currentValue) {
      if (this.fromDateInput && this.toDateInput) {
        this.getChartData();
      }
    }
  }

  private setDefaultDates(): void {
    const now = new Date();
    const dayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    this.fromDateNum = dayAgo;
    this.toDateNum = now;

    this.fromDateInput = this.fromDateNum.toISOString().slice(0, 16);
    this.toDateInput = this.toDateNum.toISOString().slice(0, 16);
  }

  loadDataForDevice(): void {
    if (this.fromDateInput && this.toDateInput) {
      this.fromDateNum = new Date(this.fromDateInput);
      this.toDateNum = new Date(this.toDateInput);

      this.timeRange.set({
        from: new Date(this.fromDateInput),
        to: new Date(this.toDateInput)
      });
    }
    this.getChartData();
  }

  getChartData(): void {
    if (!this.deviceId) return;

    this.sensorDataService.getSensorDataChart(this.deviceId, this.fromDateNum, this.toDateNum)
      .subscribe(
      (data: ChartFormat) => {
        this.deviceChartData = data;
        this.sensorsChartData = this.convertChartData();
      },
      (error) => {
        console.error('Error fetching sensor data:', error);
      }
    );
  }

  convertChartData(): ChartData[] {
    if (!this.deviceChartData) return [];
    return convertChartFormatToChartData(this.deviceChartData, this.fromDateNum, this.toDateNum);
  }

  tableGraphToggle() {
    this.isTableView = !this.isTableView;
  }

  trackById(index: number, item: ChartData): string {
    return item.title;
  }
}
