export interface ChartFormat {
  deviceId: string;
  timestamp: Date[][];
  sensorReadings: {
    [key: string]: (number | null)[][];
  };
}
