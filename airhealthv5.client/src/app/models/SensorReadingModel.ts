export interface SensorReadingModel {
  id: number;
  deviceId: string;
  mqTwo: number;
  temperature: number;
  humidity: number;
  pressure: number;
  gasResistance: number;
  pm1: number;
  pm25: number;
  pm10: number;
  timestamp: Date;
}
