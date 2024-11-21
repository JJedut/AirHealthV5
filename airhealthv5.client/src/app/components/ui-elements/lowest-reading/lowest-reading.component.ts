import {Component, OnInit} from '@angular/core';
import {SensorDataService} from "../../../services/sensor-data.service";

@Component({
  selector: 'app-lowest-reading',
  templateUrl: './lowest-reading.component.html',
  styleUrl: './lowest-reading.component.scss'
})
export class LowestReadingComponent implements OnInit {
  lowestValue: number | null = null;

  constructor(private sensorSer: SensorDataService) {
  }

  ngOnInit() {
    this.getLowestValue()
  }

  getLowestValue() {
    this.sensorSer.sharedData$.subscribe((data) => {
      if (data && data.length > 0) {
        const numericValues = data
          .map((reading) => parseFloat(reading.mqTwo?.toString() || '0'))
          .filter((val) => !isNaN(val));

        this.lowestValue = numericValues.length > 0 ? Math.min(...numericValues) : null;
      } else {
        this.lowestValue = null;
      }
    })
  }
}
