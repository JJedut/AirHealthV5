import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import {SensorDataService} from "../../../services/sensor-data.service";
import {SensorReadingModel} from "../../../models/SensorReadingModel";
import {ChartData} from "../../../models/DTO/chartData";

@Component({
  selector: 'app-sensor-chart',
  templateUrl: './sensor-chart.component.html',
  styleUrls: ['./sensor-chart.component.scss', './chart.less']
})
export class SensorChartComponent implements OnInit, OnChanges  {
  protected readonly stringify = String;
  @Input() deviceId: string | null = null;
  sensorReadings: SensorReadingModel[] = [];
  isTableView: boolean = false;
  fromDate: string = '';
  toDate: string = '';
  fromDateNum: Date = new Date();
  toDateNum: Date = new Date();
  axisYLabels: string[] = [];
  width: number = 0;

  trackById(index: number, item: ChartData): string {
    return item.title;
  }

  deviceReadings: SensorReadingModel[] = [];
  currentPage: number = 1;
  pageSize: number = 100;
  totalPages: number = 0;
  isLoading: boolean = false;

  mqTwoReadings: Readonly<[number, number]>[][] = [];
  temperatureReadings: Readonly<[number, number]>[][] = [];
  humidityReadings: Readonly<[number, number]>[][] = [];
  pressureReadings: Readonly<[number, number]>[][] = [];
  gasResistanceReadings: Readonly<[number, number]>[][] = [];
  pm1Readings: Readonly<[number, number]>[][] = [];
  pm25Readings: Readonly<[number, number]>[][] = [];
  pm10Readings: Readonly<[number, number]>[][] = [];

  constructor(private sensorDataService: SensorDataService) {}

  ngOnInit(): void {
    this.fromDateNum = new Date();
    this.toDateNum = new Date();
    this.toDateNum.setHours(this.fromDateNum.getHours() - 24); // Go back 24 hours
    this.axisYLabels = this.generateYAxisLabels(this.fromDateNum, this.toDateNum);

    this.fromDate = this.toDateNum.toISOString().substring(0, 16); // Format: YYYY-MM-DDTHH:mm
    this.toDate = this.fromDateNum.toISOString().substring(0, 16);

    this.loadDataForDevice();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['deviceId'] && changes['deviceId'].currentValue) {
      this.loadDataForDevice();
    }
  }

  fetchSensorData(): void {
    this.fromDateNum = new Date(this.fromDate);
    this.toDateNum = new Date(this.toDate);
    this.axisYLabels = this.generateYAxisLabels(this.fromDateNum, this.toDateNum);

    this.sensorDataService.getSensorData(this.deviceId, this.fromDateNum, this.toDateNum).subscribe(
      (data: SensorReadingModel[][]) => {

        // Initialize arrays for the segmented readings
        const transformData = (key: keyof SensorReadingModel) => {
          const fromTime = this.fromDateNum;
          const toTime = this.toDateNum;

          // Normalize timestamps and filter data
          return data.map(segment => {
            let normalizedData = segment
              .filter((reading) => {
                const time = new Date(reading.timestamp).getTime();
                return time >= fromTime.getTime() && time <= toTime.getTime();
              })
              .map((reading) => {
                const timestamp = (new Date(reading.timestamp).getTime() - fromTime.getTime()) / 1000; // Normalize to seconds
                const value = reading[key] ? Number(reading[key]) : 0; // Default to 0 for nulls
                return [timestamp, value] as [number, number]; // Explicitly cast to tuple
              })
              .filter(([timestamp, value]) => timestamp !== 0 || value !== 0); // Remove points with timestamp 0 and value 0

            // Remove first point with value 0, if any
            if (normalizedData.length > 0 && normalizedData[0][1] === 0) {
              normalizedData.shift();
            }

            // Remove last point with value 0, if any
            if (normalizedData.length > 0 && normalizedData[normalizedData.length - 1][1] === 0) {
              normalizedData.pop();
            }

            return normalizedData as Readonly<[number, number]>[]; // Ensure type compatibility for each segment
          });
        };

        // Generate the required arrays for each measurement (as arrays of arrays for segments)
        this.mqTwoReadings = transformData('mqTwo');
        this.temperatureReadings = transformData('temperature');
        this.humidityReadings = transformData('humidity');
        this.pressureReadings = transformData('pressure');
        this.gasResistanceReadings = transformData('gasResistance');
        this.pm1Readings = transformData('pm1');
        this.pm25Readings = transformData('pm25');
        this.pm10Readings = transformData('pm10');

        // Update the sensor readings as needed
        //this.sensorReadings = data;
        //this.sensorDataService.updateData(data);
      },
      (error) => {
        console.error('Error fetching sensor data:', error);
      }
    );
  }


  get allChartData(): ChartData[] {
    const hasData = (readings: Readonly<[number, number]>[][]) =>
      readings.some(segment => segment.some(([timestamp, value]) => value !== null && value !== 0));

    return [
      { title: 'Temperature', value: this.temperatureReadings, y: 10, height: 30 - 10, x: 0, width: this.width, yLabels: ['10°C','15°C','20°C','25°C','30°C'], xLabels: [], unit: '°C' },
      { title: 'Humidity', value: this.humidityReadings, y: 0, height: 100, x: 0, width: this.width, yLabels: ['0%','25%','50%','75%','100%'], xLabels: [], unit: '%' },
      { title: 'Pressure', value: this.pressureReadings, y: 900, height: 1100 - 900, x: 0, width: this.width, yLabels: ['900 hPa','950 hPa','1000 hPa','1050 hPa','1100 hPa'], xLabels: [], unit: 'hPa' },
      { title: 'MQ-2', value: this.mqTwoReadings, y: 0, height: 600, x: 0, width: this.width, yLabels: ['0','150','300','450','600'], xLabels: [], unit: 'ppm' },
      { title: 'VOC', value: this.gasResistanceReadings, y: 0, height: 500, x: 0, width: this.width, yLabels: ['0','125','250','375','500'], xLabels: [], unit: 'IAQ' },
      { title: 'PM 1', value: this.pm1Readings, y: 0, height: 100, x: 0, width: this.width, yLabels: ['0','25','50','75','100'], xLabels: [], unit: 'µg/m³' },
      { title: 'PM 2.5', value: this.pm25Readings, y: 0, height: 250, x: 0, width: this.width, yLabels: ['0','62.5','125','187.5','250'], xLabels: [], unit: 'µg/m³' },
      { title: 'PM 10', value: this.pm10Readings, y: 0, height: 500, x: 0, width: this.width, yLabels: ['0','125','250','375','500'], xLabels: [], unit: 'µg/m³' },
    ].filter(chart => hasData(chart.value));
  }

  tableGraphToggle() {
    this.isTableView = !this.isTableView;
  }

  generateYAxisLabels = (start: Date, end: Date): string[] => {
    this.width = (end.getTime() - start.getTime()) / 1000;
    const labels: string[] = [];
    const totalSteps = 6; // 12 labels mean 11 intervals
    const step = (end.getTime() - start.getTime()) / totalSteps;

    // Collect dates
    const dateTimes = [];
    for (let i = 0; i <= totalSteps; i++) {
      dateTimes.push(new Date(start.getTime() + step * i));
    }

    // Determine if year, month, or day can be omitted
    const allSameYear = dateTimes.every((d) => d.getFullYear() === start.getFullYear());
    const allSameMonth = dateTimes.every((d) => d.getMonth() === start.getMonth());
    const allSameDay = dateTimes.every((d) => d.getDate() === start.getDate());

    // Generate formatted labels
    dateTimes.forEach((date) => {
      let label = "";

      if (!allSameYear) label += `${date.getFullYear()}-`;
      if (!allSameMonth) label += `${(date.getMonth() + 1).toString().padStart(2, '0')}-`;
      if (!allSameDay) label += `${date.getDate().toString().padStart(2, '0')} `;

      label += `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
      labels.push(label.trim());
    });

    return labels;
  };

  //--Table--
  loadTableData(): void {
    this.isLoading = true;
    this.fromDateNum = new Date(this.fromDate);
    this.toDateNum = new Date(this.toDate);

    this.sensorDataService
      .getSensorDataTable(
      this.deviceId,
      this.fromDateNum,
      this.toDateNum,
      this.currentPage,
      this.pageSize
    )
      .subscribe({
        next: (res) => {
          this.deviceReadings = res.data;
          this.totalPages = res.totalPages;
          this.isLoading = false;
        },
        error: (err) => {
          console.error(err);
          this.isLoading = false;
        }
      });
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadTableData();
  }

  columns: { key: keyof SensorReadingModel; label: string }[] = [
    { key: 'temperature', label: 'Temp. (°C)' },
    { key: 'humidity', label: 'Humidity (%)' },
    { key: 'pressure', label: 'Pressure (hPa)' },
    { key: 'mqTwo', label: 'MQ-2 (ppm)' },
    { key: 'pm1', label: 'PM 1 (µg/m³)' },
    { key: 'pm25', label: 'PM 2.5 (µg/m³)' },
    { key: 'pm10', label: 'PM 10 (µg/m³)' },
    { key: 'gasResistance', label: 'VOC' },
  ];

  get displayedColumns() {
    return this.columns.filter(col => this.hasData(col.key));
  }

  hasData(key: keyof SensorReadingModel): boolean {
    return this.deviceReadings.some(data => {
      const value = data[key];
      return value !== null && value !== 0;
    });
  }


  loadDataForDevice(): void {
    this.loadTableData();
    this.fetchSensorData();
  }
}
