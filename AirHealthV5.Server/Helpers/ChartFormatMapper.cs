using AirHealthV5.Server.Domain.Models;

namespace AirHealthV5.Server.Helpers;

public static class ChartFormatMapper
{
    public static ChartDataFormatModel MapToChartDataFormat(List<List<DeviceReadingModel>> segmentedRecords)
    {
        if (segmentedRecords == null || segmentedRecords.Count == 0) 
            throw new ArgumentException("Sensor records cannot be null or empty");
        
        var chartData = new ChartDataFormatModel
        {
            DeviceId = segmentedRecords.First().First().DeviceId,
            Timestamp = new List<List<DateTime>>(),
            SensorReadings = new Dictionary<string, List<List<double>>>()
        };

        foreach (var segment in segmentedRecords)
        {
            var timestampSegment = new List<DateTime>();
            var sensorReadingSegment = new Dictionary<string, List<double>>();
            
            foreach (var record in segment)
            {
                timestampSegment.Add(record.Timestamp);

                if (record.SensorData != null)
                {
                    foreach (var kvp in record.SensorData)
                    {
                        if (!sensorReadingSegment.ContainsKey(kvp.Key))
                        {
                            sensorReadingSegment[kvp.Key] = new List<double>();
                        }
                
                        sensorReadingSegment[kvp.Key].Add(kvp.Value.GetValueOrDefault());
                    }
                }
            }
            
            chartData.Timestamp.Add(timestampSegment);

            foreach (var sensorKey in sensorReadingSegment.Keys)
            {
                if (!chartData.SensorReadings.ContainsKey(sensorKey))
                {
                    chartData.SensorReadings[sensorKey] = new List<List<double>>();
                }
                
                chartData.SensorReadings[sensorKey].Add(sensorReadingSegment[sensorKey]);
            }
        }
        
        return chartData;
    }
}