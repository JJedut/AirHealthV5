export interface ThresholdsValue {
  min?: number | null;
  max?: number | null;
  minCritical?: number | null;
  maxCritical?: number | null;
}

export interface ThresholdsModel {
  sensorThresholds: Record<string, ThresholdsValue>;
}
