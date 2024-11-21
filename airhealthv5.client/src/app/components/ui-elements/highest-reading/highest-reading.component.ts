import {Component, OnInit} from '@angular/core';
import {SensorDataService} from "../../../services/sensor-data.service";

@Component({
  selector: 'app-highest-reading',
  templateUrl: './highest-reading.component.html',
  styleUrl: './highest-reading.component.scss'
})
export class HighestReadingComponent implements OnInit{
  highestValue: number | null = null;

  constructor(private sensorSer: SensorDataService) {
  }

  ngOnInit() {
    this.getHighestValue()
  }

  getHighestValue() {
    this.sensorSer.sharedData$.subscribe((data) => {
      if (data && data.length > 0) {
        const numericValues = data
          .map((reading) => parseFloat(reading.mqTwo?.toString() || '0'))
          .filter((val) => !isNaN(val));

        this.highestValue = numericValues.length > 0 ? Math.max(...numericValues) : null;
      } else {
        this.highestValue = null;
      }
    })
  }
}
