import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {SensorDataService} from "../../../services/sensor-data.service";
import {SensorReadingModel} from "../../../models/SensorReadingModel";
import {ChartData} from "../../../models/chartData";

@Component({
  selector: 'app-sensor-chart',
  templateUrl: './sensor-chart.component.html',
  styleUrls: ['./sensor-chart.component.scss', './chart.less']
})
export class SensorChartComponent implements OnInit, OnChanges {
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

  mqTwoReadings: Readonly<[number, number]>[] = [];
  temperatureReadings: Readonly<[number, number]>[] = [];
  humidityReadings: Readonly<[number, number]>[] = [];
  pressureReadings: Readonly<[number, number]>[] = [];
  gasResistanceReadings: Readonly<[number, number]>[] = [];
  pm1Readings: Readonly<[number, number]>[] = [];
  pm25Readings: Readonly<[number, number]>[] = [];
  pm10Readings: Readonly<[number, number]>[] = [];

  constructor(private sensorDataService: SensorDataService) {}

  ngOnInit(): void {
    this.fromDateNum = new Date();
    this.toDateNum = new Date();
    this.toDateNum.setHours(this.fromDateNum.getHours() - 24); // Go back 24 hours
    this.axisYLabels = this.generateYAxisLabels(this.fromDateNum, this.toDateNum);

    this.fromDate = this.toDateNum.toISOString().substring(0, 16); // Format: YYYY-MM-DDTHH:mm
    this.toDate = this.fromDateNum.toISOString().substring(0, 16);

    this.fetchSensorData();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['deviceId'] && changes['deviceId'].currentValue) {
      console.log('Device ID changed:', this.deviceId);
      this.fetchSensorData();
    }
  }

  fetchSensorData(): void {
    this.fromDateNum = new Date(this.fromDate);
    this.toDateNum = new Date(this.toDate);
    this.axisYLabels = this.generateYAxisLabels(this.fromDateNum, this.toDateNum);

    this.sensorDataService.getSensorData(this.deviceId, this.fromDateNum, this.toDateNum).subscribe(
      (data: SensorReadingModel[]) => {
        const firstTimestamp = new Date(data[0]?.timestamp || 0).getTime();
        console.log('data: ',data)

        const transformData = (key: keyof SensorReadingModel) => {
          const fromTime = this.fromDateNum;
          const toTime = this.toDateNum;

          // Normalize timestamps and filter data
          let normalizedData = data
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

          return normalizedData as Readonly<[number, number]>[]; // Ensure type compatibility
        };

        // Generate the required arrays for each measurement
        this.mqTwoReadings = transformData('mqTwo');
        this.temperatureReadings = transformData('temperature');
        this.humidityReadings = transformData('humidity');
        this.pressureReadings = transformData('pressure');
        this.gasResistanceReadings = transformData('gasResistance');
        this.pm1Readings = transformData('pm1');
        this.pm25Readings = transformData('pm25');
        this.pm10Readings = transformData('pm10');

        // Optional: log the transformed data
        console.log('pm10Readings:', this.pm10Readings);
        console.log('Temperature readings:', this.temperatureReadings);
        console.log('Humidity readings:', this.humidityReadings);

        // Update the sensor readings as needed
        this.sensorReadings = data;
        this.sensorDataService.updateData(data);
      },
      (error) => {
        console.error('Error fetching sensor data:', error);
      }
    );

  }

  get allChartData(): ChartData[] {
    return [
      { id: 1, title: 'Temperature', measurement: this.temperatureReadings, minY: 10, maxY: 30, hide: true },
      { id: 2, title: 'Humidity', measurement: this.humidityReadings, minY: 0, maxY: 100, hide: true },
      { id: 3, title: 'Pressure', measurement: this.pressureReadings, minY: 900, maxY: 1100, hide: true },
      { id: 4, title: 'MQ2', measurement: this.mqTwoReadings, minY: 0, maxY: 600, hide: true },
      { id: 5, title: 'Gas Resistance', measurement: this.gasResistanceReadings, minY: 0, maxY: 10000, hide: true },
      { id: 6, title: 'PM 1', measurement: this.pm1Readings, minY: 0, maxY: 100, hide: false },
      { id: 7, title: 'PM 2.5', measurement: this.pm25Readings, minY: 0, maxY: 250, hide: false },
      { id: 8, title: 'PM 10', measurement: this.pm10Readings, minY: 0, maxY: 500, hide: false },
    ];
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

  //todo do it better
  columns: { key: keyof SensorReadingModel; label: string }[] = [
    { key: 'temperature', label: 'Temp. (°C)' },
    { key: 'humidity', label: 'Humidity (%)' },
    { key: 'pressure', label: 'Pressure (hPa)' },
    { key: 'mqTwo', label: 'MQ2 (ppm)' },
    { key: 'pm1', label: 'PM 1 (µg/m³)' },
    { key: 'pm25', label: 'PM 2.5 (µg/m³)' },
    { key: 'pm10', label: 'PM 10 (µg/m³)' },
    { key: 'gasResistance', label: 'Gas Res. (ohms)' },
  ];

  get displayedColumns() {
    return this.columns.filter(col => this.hasData(col.key));
  }

  hasData(key: keyof SensorReadingModel): boolean {
    return this.sensorReadings.some(data => {
      const value = data[key];
      return value !== null && value !== 0;
    });
  }
}
