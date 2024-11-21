export interface Thresholds {
  temperatureMin: number;
  humidityMin: number;
  pressureMin: number;
  gasResistanceMin: number;
  mqTwoMin: number;
  pm1Min: number;
  pm25Min: number;
  pm10Min: number;

  temperatureMax: number;
  humidityMax: number;
  pressureMax: number;
  gasResistanceMax: number;
  mqTwoMax: number;
  pm1Max: number;
  pm25Max: number;
  pm10Max: number;

  temperatureMinCritical: number;
  humidityMinCritical: number;
  pressureMinCritical: number;
  gasResistanceMinCritical: number;
  mqTwoMinCritical: number;
  pm1MinCritical: number;
  pm25MinCritical: number;
  pm10MinCritical: number;

  temperatureMaxCritical: number;
  humidityMaxCritical: number;
  pressureMaxCritical: number;
  gasResistanceMaxCritical: number;
  mqTwoMaxCritical: number;
  pm1MaxCritical: number;
  pm25MaxCritical: number;
  pm10MaxCritical: number;
}
