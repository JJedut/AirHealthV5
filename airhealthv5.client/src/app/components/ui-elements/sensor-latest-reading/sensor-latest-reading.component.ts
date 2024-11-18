import {ChangeDetectorRef, Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges} from '@angular/core';
import {SensorDataService} from "../../../services/sensor-data.service";
import {SensorReadingModel} from "../../../models/SensorReadingModel";
import {interval, Subscription} from "rxjs";
import {startWith, switchMap} from "rxjs/operators";
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import {DeviceService} from "../../../services/device.service";

@Component({
  selector: 'app-sensor-latest-reading',
  templateUrl: './sensor-latest-reading.component.html',
  styleUrls: ['./sensor-latest-reading.component.scss']
})
export class SensorLatestReadingComponent implements OnInit, OnDestroy, OnChanges {
  @Input() deviceId: string | null = null;
  sensorReadings: { id: number; label: string; value: string | null }[] = [];
  private pollingSubscription: Subscription | undefined;
  order: number[] = [];

  constructor(
    private sensorDataService: SensorDataService,
    private cdr: ChangeDetectorRef,
    private deviceService: DeviceService,
  ) { }

  ngOnInit(): void {
    this.fetchDataForDevice();
  }

  private fetchDataForDevice(): void {
    if (!this.deviceId) {
      return;
    }

    this.sensorReadings = [];
    this.order = [];

    this.getOrder();

    this.pollingSubscription = interval(30000)
      .pipe(
        startWith(0),
        switchMap(() => this.sensorDataService.getLatestSensorReading(this.deviceId))
      )
      .subscribe({
        next: (reading) => {
          this.updateSensorReadings(reading);
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Error fetching latest sensor reading:', err);
          this.sensorReadings = [];
        }
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['deviceId'] && this.deviceId) {
      this.fetchDataForDevice();
    }
  }

  ngOnDestroy(): void {
    if (this.pollingSubscription) {
      this.pollingSubscription.unsubscribe();
    }
    this.sensorDataService.stopPolling();
  }

  private updateSensorReadings(reading: SensorReadingModel): void {
    this.sensorReadings = [
      { id: 1, label: 'Temperature', value: reading.temperature !== null ? `${this.twoDecimal(reading.temperature)}°C` : null },
      { id: 2, label: 'Humidity', value: reading.humidity !== null ? `${this.twoDecimal(reading.humidity)}%` : null },
      { id: 3, label: 'Pressure', value: reading.pressure !== null ? `${reading.pressure} hPa` : null },
      { id: 4, label: 'MQ2', value: reading.mqTwo !== null ? `${reading.mqTwo} ppm` : null },
      { id: 5, label: 'Gas Resistance', value: reading.gasResistance !== null ? `${this.twoDecimal(reading.gasResistance)} ohms` : null },
      { id: 6, label: 'PM 1', value: reading.pm1 !== null ? `${reading.pm1} µg/m³` : null },
      { id: 7, label: 'PM 2.5', value: reading.pm25 !== null ? `${reading.pm25} µg/m³` : null },
      { id: 8, label: 'PM 10', value: reading.pm10 !== null ? `${reading.pm10} µg/m³` : null },
    ];

    this.applyOrderToReadings(this.order);
  }

  saveOrder(order: number[]) {
    const deviceId = this.deviceService.currentDeviceId;
    if (!deviceId) return;

    this.deviceService.saveSensorOrder(deviceId, order).subscribe({
      next: (response) => console.log('Order saved', response),
      error: (error) => console.error(error),
    });
  }

  getOrder() {
    const deviceId = this.deviceService.currentDeviceId;

    if (!deviceId) {
      console.error('Device ID is null or undefined.');
      return;
    }

    this.deviceService.getSensorOrder(deviceId).subscribe({
      next: (order) => {
        console.log('Order retrieved:', order);
        if (order.length == 0) {
          this.order = [1,2,3,4,5,6,7,8];
          this.saveOrder(this.order);
          return;
        }
        this.order = order;
      },
      error: (error) => {
        console.error('Error retrieving order:', error);
      }
    });
  }

  private applyOrderToReadings(order: number[]) {
    if (!this.sensorReadings.length) {
      console.warn('Sensor readings are empty. Cannot apply order.');
      return;
    }

    const readingMap = new Map(this.sensorReadings
      .map((reading) => [reading.id, reading]));

    this.sensorReadings = order
      .map((id) => readingMap.get(id))
      .filter((reading) => reading !== undefined) as { id: number; label: string; value: string | null }[];

    console.log('Reordered sensorReadings:', this.sensorReadings);
  }

  drop(event: CdkDragDrop<{ label: string; value: string }[]>) {
    moveItemInArray(this.sensorReadings, event.previousIndex, event.currentIndex);

    const newOrder = this.sensorReadings.map(item => item.id);
    this.saveOrder(newOrder);
  }

  twoDecimal(num: number): string {
    return (parseFloat(String(num)).toFixed(2))
  }
}
