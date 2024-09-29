import {Component, OnInit} from '@angular/core';
import {SensorDataService} from "../../../services/sensor-data.service";
import {SensorReadingModel} from "../../../models/SensorReadingModel";

@Component({
  selector: 'app-sensor-chart',
  templateUrl: './sensor-chart.component.html',
  styleUrl: './sensor-chart.component.scss'
})
export class SensorChartComponent implements OnInit {
  sensorReadings: SensorReadingModel[] = [];
  fromDate: string = '';
  toDate: string = '';

  constructor(private sensorDataService: SensorDataService) {}

  ngOnInit(): void {
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    this.fromDate = yesterday.toISOString().substring(0, 10); // Format: YYYY-MM-DD
    this.toDate = today.toISOString().substring(0, 10); // Format: YYYY-MM-DD

    //this.fetchSensorData();
  }

  fetchSensorData(): void {
    if (this.fromDate && this.toDate) {
      const fromDateObj = new Date(this.fromDate);
      const toDateObj = new Date(this.toDate);
      this.sensorDataService.getSensorData(fromDateObj, toDateObj).subscribe(
        (data) => {
          this.sensorReadings = data;
          console.log(this.sensorReadings);
        },
        (error) => {
          console.error('Error fetching sensor data:', error);
        }
      );
    }
  }
}
