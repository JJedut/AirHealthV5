import {ChangeDetectorRef, Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges} from '@angular/core';
import {SensorDataService} from "../../../services/sensor-data.service";
import {interval, Subscription} from "rxjs";
import {startWith, switchMap} from "rxjs/operators";
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import {DeviceService} from "../../../services/device.service";
import {DeviceModel} from "../../../models/DeviceModel";
import {SensorReadingDTO} from "../../../models/DTO/SensorReadingDTO";
import {ThresholdsModel} from "../../../models/Thresholds";

interface SensorReadingDisplay {
  id: number;
  label: string;
  value: string | null;
  state: 'safe' | 'warning' | 'critical'
}

@Component({
  selector: 'app-sensor-latest-reading',
  templateUrl: './sensor-latest-reading.component.html',
  styleUrls: ['./sensor-latest-reading.component.scss']
})
export class SensorLatestReadingComponent implements OnInit, OnDestroy, OnChanges {
  @Input() deviceId: string | null = null;

  sensorReadings: SensorReadingDisplay[] = [];
  dataLength: number | null = null;
  devices: DeviceModel[] = [];
  thresholds: ThresholdsModel | null = null;
  order: number[] = [];

  private pollingSubscription?: Subscription;
  private readonly POLLING_INTERVAL = 30000;
  private readonly DEFAULT_ORDER = [1,2,3,4,5,6,7,8];

  constructor(
    private sensorDataService: SensorDataService,
    private cdr: ChangeDetectorRef,
    private deviceService: DeviceService,
  ) { }

  ngOnInit(): void {
    this.initializeData();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['deviceId'] && this.deviceId) {
      this.stopPolling();
      this.initializeData();
    }
  }

  ngOnDestroy(): void {
    this.stopPolling();
  }

  private initializeData(): void {
    if (!this.deviceId) {
      this.resetData();
      return;
    }

    this.fetchThresholds();
    this.getOrder();
    this.startPolling();
  }

  private resetData(): void {
    this.sensorReadings = [];
    this.order = [];
    this.thresholds = null;
  }

  private startPolling(): void {
    if (!this.deviceId) return;

    this.pollingSubscription = interval(this.POLLING_INTERVAL)
      .pipe(
        startWith(0),
        switchMap(() => this.sensorDataService.getLatestSensorReading(this.deviceId))
      )
      .subscribe({
        next: (res) => {
          this.updateSensorReadings(res);
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Error while fetching sensor data.', err);
          this.sensorReadings = [];
        }
      })
  }

  private stopPolling(): void {
    this.pollingSubscription?.unsubscribe();
  }

  private fetchThresholds(): void {
    if (!this.deviceId) return;

    this.deviceService.getThresholdByDeviceId(this.deviceId).subscribe({
      next: (thresholds) => (this.thresholds = thresholds),
      error: (err) => console.error('Error fetching thresholds:', err),
    });
  }

  private getOrder() {
    const deviceId = this.deviceService.currentDeviceId;

    if (!deviceId) {
      console.error('Device ID is null or undefined.');
      return;
    }

    this.deviceService.getSensorOrder(deviceId).subscribe({
      next: (order) => {
        this.order = order.length ? order : this.DEFAULT_ORDER;
        if (!order.length) this.saveOrder(this.order);
      },
      error: (error) => console.error('Error retrieving order:', error)
    });
  }

  saveOrder(order: number[]) {
    const deviceId = this.deviceService.currentDeviceId;
    if (!deviceId) return;

    this.deviceService.saveSensorOrder(deviceId, order).subscribe({
      next: (response) => console.log('Order saved', response),
      error: (error) => console.error(error),
    });
  }

  private updateSensorReadings(reading: SensorReadingDTO): void {
    this.dataLength = Object.keys(reading.sensorData).length;
    const data = reading.sensorData;
    const readings = Object.entries(data).map(([key, value], index) => ({
      id: index + 1,
      label: this.formatedLabel(key),
      value: value != null ? this.formatValue(key, value) : null,
      state: this.getState(key, value)
    }));

    this.sensorReadings = this.applyOrderToReadings(readings, this.order);
  }

  private applyOrderToReadings(readings: SensorReadingDisplay[], order: number[]): SensorReadingDisplay[] {
    const map = new Map(readings.map(reading => [reading.id, reading]));
    return order.map((id) => map.get(id)).filter((r): r is SensorReadingDisplay => !!r);
  }

  private getState(type: string, value: number | null): 'safe' | 'warning' | 'critical' {
    if (value === null || !this.thresholds) return 'safe';

    const sensorThreshold = this.thresholds.sensorThresholds[type];
    if (!sensorThreshold) return 'safe';

    const { min, max, minCritical, maxCritical } = sensorThreshold;

    if ((minCritical != null && value <= minCritical) ||
        (maxCritical != null && value >= maxCritical)) {
      return 'critical';
    }
    if ((min != null && value <= min) ||
        (max != null && value >= max)) {
      return 'warning';
    }
    return 'safe';
  }

  private formatedLabel(key: string): string {
    return key.replace(/([a-z])([A-Z])/g, '$1 $2');
  }

  private formatValue(key: string, value: number): string {
    const num = value.toFixed(2);
    switch (key.toLowerCase()) {
      case 'temperature': return `${num}°C`;
      case 'humidity': return `${num}%`;
      case 'pressure': return `${num}hPa`;
      default: return num;
    }
  }

  drop(event: CdkDragDrop<{ label: string; value: string }[]>) {
    moveItemInArray(this.sensorReadings, event.previousIndex, event.currentIndex);

    const newOrder = this.sensorReadings.map(item => item.id);
    this.saveOrder(newOrder);
  }
}
