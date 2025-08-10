import {SensorReadingModel} from "../SensorReadingModel";
import {SensorReadingDTO} from "./SensorReadingDTO";

export interface PaginatedData {
  data: SensorReadingDTO[];
  totalPages: number;
}
