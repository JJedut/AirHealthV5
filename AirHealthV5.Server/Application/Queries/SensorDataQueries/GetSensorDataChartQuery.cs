using AirHealthV5.Server.Domain.Models;
using AirHealthV5.Server.Domain.Models.DTO;
using AirHealthV5.Server.Helpers;
using AirHealthV5.Server.Interfaces.Repository;
using MediatR;

namespace AirHealthV5.Server.Application.Queries.SensorDataQueries;

public class SensorDataChartQuery : IRequest<ChartDataFormatModel>
{
    public DateTime? From { get; set; }
    public DateTime? To { get; set; }
    public Guid DeviceId { get; set; }
}
public class GetSensorDataChartQuery : IRequestHandler<SensorDataChartQuery, ChartDataFormatModel>
{
    IDeviceReadingRepository _deviceReadingRepository;

    public GetSensorDataChartQuery(IDeviceReadingRepository deviceReadingRepository)
    {
        _deviceReadingRepository = deviceReadingRepository;
    }

    public async Task<ChartDataFormatModel> Handle(SensorDataChartQuery request, CancellationToken cancellationToken)
    {
        if (request.From == null || request.To == null || request.From > request.To)
        {
            throw new ArgumentException("Invalid time window request");
        }

        var sensorReadings = await _deviceReadingRepository
            .GetSensorReadingsAsync(request, cancellationToken);
        
        if (!sensorReadings.Any())
            return new ChartDataFormatModel();
        
        // Limit readings
        const int pointsLimit = 250;
        int pointsTotal = sensorReadings.Count();
        var sampledSensorReadings = new List<DeviceReadingModel>();

        if (pointsTotal < pointsLimit)
        {
            sampledSensorReadings = sensorReadings;
        }
        else
        {
            double step = (double)(pointsTotal - 2) / (pointsLimit - 2);

            sampledSensorReadings.Add(sensorReadings.First());
            
            for (int i = 1; i < pointsLimit - 1; i++)
            {
                int index = (int)Math.Floor(i * step);
                sampledSensorReadings.Add(sensorReadings[index]);
            }
            
            sampledSensorReadings.Add(sensorReadings.Last());
        }

        // Split readings into segments based on time gaps
        const int gapThresholdSeconds = 300;
        var segmentedReadings = new List<List<DeviceReadingModel>>();
        var currentSegment = new List<DeviceReadingModel>();

        for (int i = 0; i < sampledSensorReadings.Count; i++)
        {
            var reading = sampledSensorReadings[i];
            var nextReading = i < sampledSensorReadings.Count - 1 ? sampledSensorReadings[i + 1] : null;

            currentSegment.Add(reading);

            if (nextReading != null)
            {
                var timeDifference = (nextReading.Timestamp - reading.Timestamp).TotalSeconds;
                if (timeDifference > gapThresholdSeconds)
                {
                    segmentedReadings.Add(new List<DeviceReadingModel>(currentSegment));
                    currentSegment.Clear();
                }
            }
        }
        
        if (currentSegment.Any())
        {
            segmentedReadings.Add(new List<DeviceReadingModel>(currentSegment));
        }

        var formattedChartData = ChartFormatMapper.MapToChartDataFormat(segmentedReadings);

        return formattedChartData;
    }
}