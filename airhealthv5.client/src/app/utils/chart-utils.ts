import {ChartFormat} from "../models/ChartFormat";
import {ChartData} from "../models/DTO/chartData";

export function convertChartFormatToChartData(
  input: ChartFormat,
  startTime: Date,
  endTime: Date,
): ChartData[] {
  const width = (endTime.getTime() - startTime.getTime()) / 1000;

  const numLabels = 7;
  const timeStep = (endTime.getTime() - startTime.getTime()) / (numLabels - 1);
  const xLabels = Array.from({ length: numLabels }, (_, i) => {
    const date = new Date(startTime.getTime() + i * timeStep);
    const hh = String(date.getHours()).padStart(2, "0");
    const mm = String(date.getMinutes()).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    return `${hh}:${mm} ${dd}.${month}`;
  });

  const globalBaseTime = startTime.getTime();

  console.log('startTime: ',startTime,'endTime: ',endTime)

  return Object.entries(input.sensorReadings).map(([sensorKey, segments]) => {
    const allValues = segments.flat().filter((val): val is number => val !== null);
    const minValue = Math.min(...allValues);
    const maxValue = Math.max(...allValues);

    const yMin = Math.floor(minValue - 10);
    const yMax = Math.ceil(maxValue + 10);
    const height = yMax - yMin;

    const step = Math.max(1, Math.round(height / 4));
    const yLabels = Array.from({length: 5}, (_, i) => `${yMin + i * step}`);

    const value: Readonly<[number, number]>[][] =[];
    const timestampSegments = input.timestamp;

    segments.forEach((segment, segIndex) => {
      const timestamps = timestampSegments[segIndex];
      const segmentPoints: [number, number][] = [];

      segment.forEach((val, i) => {
        if (val === null || !timestamps || !timestamps[i]) return;

        const time = ((new Date(timestamps[i]).getTime() - globalBaseTime) / 1000) + 7200;
        const roundedVal = Math.round(val * 100) / 100;
        segmentPoints.push([time, roundedVal]);
      })

      if (segmentPoints.length >= 2) {
        value.push(segmentPoints);
      }
    });

    return {
      title: sensorKey,
      yLabels,
      xLabels,
      height,
      width,
      x: 0,
      y: yMin,
      value,
      unit: 'unit'
    };
  });
}

