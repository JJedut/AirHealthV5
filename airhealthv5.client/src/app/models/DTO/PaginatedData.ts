import {SensorReadingModel} from "../SensorReadingModel";

export interface PaginatedData {
  data: SensorReadingModel[];
  totalPages: number;
}
