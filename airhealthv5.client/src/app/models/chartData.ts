export interface ChartData {
  id: number;
  title: string,
  measurement: Readonly<[number, number]>[],
  minY: number,
  maxY: number,
  hide: boolean,
}
