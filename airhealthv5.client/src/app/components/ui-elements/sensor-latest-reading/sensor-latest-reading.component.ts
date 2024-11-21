import {ChangeDetectorRef, Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges} from '@angular/core';
import {SensorDataService} from "../../../services/sensor-data.service";
import {SensorReadingModel} from "../../../models/SensorReadingModel";
import {interval, Subscription} from "rxjs";
import {startWith, switchMap} from "rxjs/operators";
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import {DeviceService} from "../../../services/device.service";
import {Thresholds} from "../../../models/Thresholds";
import {DeviceModel} from "../../../models/DeviceModel";

@Component({
  selector: 'app-sensor-latest-reading',
  templateUrl: './sensor-latest-reading.component.html',
  styleUrls: ['./sensor-latest-reading.component.scss']
})
export class SensorLatestReadingComponent implements OnInit, OnDestroy, OnChanges {
  @Input() deviceId: string | null = null;
  sensorReadings: { id: number; label: string; value: string | null; state: 'safe' | 'warning' | 'critical' }[] = [];
  private pollingSubscription: Subscription | undefined;
  devices: DeviceModel[] = [];
  thresholds!: any;
  order: number[] = [];

  constructor(
    private sensorDataService: SensorDataService,
    private cdr: ChangeDetectorRef,
    private deviceService: DeviceService,
  ) { }

  ngOnInit(): void {
    this.fetchDataForDevice();
    this.fetchThresholds();
  }

  private fetchThresholds(): void {
    if (!this.deviceId) {
      this.thresholds = null; // Reset thresholds when switching devices
      return;
    }

    this.deviceService.getThresholdByDeviceId(this.deviceId).subscribe({
      next: (thresholds) => {
        this.thresholds = thresholds;
        //this.updateSensorReadings(this.sensorReadings); // Update readings with thresholds
      },
      error: (err) => console.error('Error fetching thresholds:', err),
    });
  }

  private fetchDataForDevice(): void {
    if (!this.deviceId) {
      this.sensorReadings = [];
      this.order = [];
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
      if (this.pollingSubscription) {
        this.pollingSubscription.unsubscribe();
      }
      this.fetchDataForDevice();
      this.fetchThresholds();
    }
  }

  ngOnDestroy(): void {
    if (this.pollingSubscription) {
      this.pollingSubscription.unsubscribe();
    }
  }

  private updateSensorReadings(reading: SensorReadingModel): void {
    this.sensorReadings = [
      { id: 1, label: 'Temperature', value: reading.temperature !== null ? `${this.twoDecimal(reading.temperature)}°C` : null, state: this.getState('temperature', reading.temperature) },
      { id: 2, label: 'Humidity', value: reading.humidity !== null ? `${this.twoDecimal(reading.humidity)}%` : null, state: this.getState('humidity', reading.humidity) },
      { id: 3, label: 'Pressure', value: reading.pressure !== null ? `${reading.pressure} hPa` : null, state: this.getState('pressure', reading.pressure) },
      { id: 4, label: 'MQ2', value: reading.mqTwo !== null ? `${reading.mqTwo} ppm` : null, state: this.getState('mqTwo', reading.mqTwo) },
      { id: 5, label: 'Gas Resistance', value: reading.gasResistance !== null ? `${this.twoDecimal(reading.gasResistance)} ohms` : null, state: this.getState('gasResistance', reading.gasResistance) },
      { id: 6, label: 'PM 1', value: reading.pm1 !== null ? `${reading.pm1} µg/m³` : null, state: this.getState('pm1', reading.pm1) },
      { id: 7, label: 'PM 2.5', value: reading.pm25 !== null ? `${reading.pm25} µg/m³` : null, state: this.getState('pm25', reading.pm25) },
      { id: 8, label: 'PM 10', value: reading.pm10 !== null ? `${reading.pm10} µg/m³` : null, state: this.getState('pm10', reading.pm10) },
    ];

    this.applyOrderToReadings(this.order);
  }

  private getState(type: string, value: number | null): 'safe' | 'warning' | 'critical' {
    if (value === null || !this.thresholds) return 'safe';

    const min = this.thresholds[`${type}Min`];
    const max = this.thresholds[`${type}Max`];
    const minCritical = this.thresholds[`${type}MinCritical`];
    const maxCritical = this.thresholds[`${type}MaxCritical`];

    console.log(type,' min: ', min,' max: ', max,' minCritical: ', minCritical,' maxCritical: ', maxCritical);

    if (minCritical !== null && value <= minCritical || maxCritical !== null && value >= maxCritical) {
      return 'critical';
    }
    if (min !== null && value <= min || max !== null && value >= max) {
      return 'warning';
    }
    return 'safe';
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
      .filter((reading) => reading !== undefined) as { id: number; label: string; value: string | null; state: 'safe' | 'warning' | 'critical' }[];

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
