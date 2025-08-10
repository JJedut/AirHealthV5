import {Component, effect, Input, OnInit, Signal} from '@angular/core';
import {SensorDataService} from "../../../../services/sensor-data.service";
import {SensorReadingModel} from "../../../../models/SensorReadingModel";
import {TimeRange} from "../../../../models/TimeRange";
import {SensorReadingDTO} from "../../../../models/DTO/SensorReadingDTO";
import {FormatKeyToTitle} from "../../../../utils/FormatKeyToTitle";

interface FlattenedSensorReading {
  timestamp: Date;
  [key: string]: any;
}

interface DisplayColumn {
  key: string;
  label: string
}

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss'
})
export class TableComponent implements OnInit {
  @Input() deviceId: string | null = null;
  @Input({ required: true }) timeRange!: Signal<TimeRange>;

  fromDate: Date = new Date();
  toDate: Date = new Date();

  deviceReadingsTable: FlattenedSensorReading[] = [];
  displayedColumns: DisplayColumn[] = [];

  currentPage: number = 1;
  pageSize: number = 100;
  totalPages: number = 0;
  isLoading: boolean = false;

  constructor(private sensorDataService: SensorDataService) {
    effect(() => {
      const range = this.timeRange();

      if (range?.from && range?.to) {
        this.fromDate = range.from;
        this.toDate = range.to;
        this.getTableData();
      }
    })
  }

  ngOnInit(): void {
  }

  getTableData(): void {
    this.isLoading = true;

    this.sensorDataService
      .getSensorDataTable(
        this.deviceId,
        this.fromDate,
        this.toDate,
        this.currentPage,
        this.pageSize
      )
      .subscribe({
        next: (res) => {
          const rawData = res.data || [];

          this.deviceReadingsTable = rawData.map(item => ({
            ...item.sensorData,
            timestamp: new Date(item.timestamp)
          }));

          const firstSensorData = rawData[0]?.sensorData || {};

          this.displayedColumns = Object.keys(firstSensorData).map(key => ({
            key,
            label: key
          }))

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
    this.getTableData();
  }

  protected readonly FormatKeyToTitle = FormatKeyToTitle;
}
