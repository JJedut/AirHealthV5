export interface ChartData {
  title: string;
  yLabels: string[];
  xLabels: string[];
  height: number;
  width: number;
  x: number;
  y: number;
  value: Readonly<[number, number]>[][];
  unit: string;
}
