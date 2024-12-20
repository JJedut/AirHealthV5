import {Component, Input, OnInit} from '@angular/core';
import {SensorDataService} from "../../../../services/sensor-data.service";
import {SensorReadingModel} from "../../../../models/SensorReadingModel";
import {TimeRange} from "../../../../models/TimeRange";

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss'
})
export class TableComponent implements OnInit {
  @Input() timeRange!: TimeRange;
  @Input() deviceId: string | null = null;
  deviceReadings: SensorReadingModel[] = [];
  currentPage: number = 1;
  pageSize: number = 500;
  totalPages: number = 0; // Adjust if API provides total count
  isLoading: boolean = false;

  constructor(private sensorDataService: SensorDataService) {}

  ngOnInit(): void {
   this.loadSensorData();
  }

  printTest() {
    console.error('Test kutsa');
  }

  loadSensorData(): void {
    this.isLoading = true;
    const from = new Date(Date.now() - 24 * 60 * 60 * 1000); // Last 24 hours
    const to = new Date();

    this.sensorDataService.getSensorDataTable(this.deviceId, from, to, this.currentPage, this.pageSize)
      .subscribe({
        next: (data) => {
          //this.deviceReadings = data;
          console.log('deviceReadings: ', this.deviceReadings);
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
    this.loadSensorData();
  }

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
    return this.deviceReadings.some(data => {
      const value = data[key];
      return value !== null && value !== 0;
    });
  }
}
