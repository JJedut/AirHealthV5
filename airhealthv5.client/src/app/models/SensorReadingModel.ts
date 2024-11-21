export interface SensorReadingModel {
  id: number;
  deviceId: string;
  mqTwo: number | null;
  temperature: number | null;
  humidity: number | null;
  pressure: number | null;
  gasResistance: number | null;
  pm1: number | null;
  pm25: number | null;
  pm10: number | null;
  timestamp: Date;
}
