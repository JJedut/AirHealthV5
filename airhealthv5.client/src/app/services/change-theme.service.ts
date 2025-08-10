import {Injectable, Renderer2, RendererFactory2} from '@angular/core';
import {SensorDataService} from "./sensor-data.service";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class ChangeThemeService {
  private renderer: Renderer2;

  constructor(
    private http: HttpClient,
    private rendererFactory: RendererFactory2,
    private sensor: SensorDataService
  ) {
    this.renderer = this.rendererFactory.createRenderer(null, null);
  }

  applyThemeBasedOnReading(): void {
    this.sensor.getLatestSensorReading().subscribe(res => {
      const value = res.value ? +res.value : 0;
      const theme = this.mapValueToTheme(value);
      this.setAppTheme(theme);
    });
  }

  private mapValueToTheme(value: number): string {
    if (value <= 50) {
      return 'green-theme';
    } else if (value <= 100) {
      return 'yellow-theme';
    } else if (value <= 150) {
      return 'orange-theme';
    } else {
      return 'red-theme';
    }
  }

  getColorBasedOnValue(value: number): string {
    if (value <= 50) {
      return '#4CAF50';   // Green
    } else if (value <= 100) {
      return '#FFEB3B';  // Yellow
    } else if (value <= 150) {
      return '#FF9800';  // Orange
    } else {
      return '#F44336';   // Red
    }
  }

  private setAppTheme(themeClass: string): void {
    const body = document.querySelector('body');

    body?.classList.remove('green-theme', 'yellow-theme', 'orange-theme', 'red-theme');

    body?.classList.add(themeClass);
  }
}
