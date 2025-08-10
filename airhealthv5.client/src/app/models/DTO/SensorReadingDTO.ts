export interface SensorReadingDTO {
  id: number;
  deviceId: string;
  timestamp: Date;

  sensorData: {
    [key: string]: number | null;
  };
}
