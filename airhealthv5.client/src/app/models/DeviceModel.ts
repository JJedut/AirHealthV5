import {ThresholdsModel} from "./Thresholds";

export interface DeviceModel {
  id: number;
  deviceId: string;
  deviceName: string;
  apiKey: string;
  userId: string;
  isActive: boolean;
  lastUpdate: Date;
  created: Date;
  sensorOrder: number[];
  thresholds: ThresholdsModel | null;
}
