using AirHealthV5.Server.Domain.Models;
using AirHealthV5.Server.Interfaces.Repository;
using MediatR;

namespace AirHealthV5.Server.Application.Queries.SensorDataQueries;

public class SensorDataQuery : IRequest<List<List<DeviceReadingModel>>>
{
    public DateTime? From { get; set; }
    public DateTime? To { get; set; }
    public Guid DeviceId { get; set; }
}
public class GetSensorDataQuery : IRequestHandler<SensorDataQuery, List<List<DeviceReadingModel>>>
{
    IDeviceReadingRepository _deviceReadingRepository;

    public GetSensorDataQuery(IDeviceReadingRepository deviceReadingRepository)
    {
        _deviceReadingRepository = deviceReadingRepository;
    }

    public async Task<List<List<DeviceReadingModel>>> Handle(SensorDataQuery request, CancellationToken cancellationToken)
    {
        // Validate request
        if (request.From == null || request.To == null || request.From > request.To)
        {
            throw new ArgumentException("Invalid time window request");
        }

        // Fetch raw sensor readings from repository
        var sensorReadings = await _deviceReadingRepository
            .GetSensorReadingsAsync(request, cancellationToken);

        // If no data is found, return an empty list
        if (!sensorReadings.Any())
            return new List<List<DeviceReadingModel>>();

        // Split readings into segments based on time gaps
        const int gapThresholdSeconds = 300; // Define a gap threshold (e.g., 5 minutes)
        var segmentedReadings = new List<List<DeviceReadingModel>>();
        var currentSegment = new List<DeviceReadingModel>();

        for (int i = 0; i < sensorReadings.Count; i++)
        {
            var reading = sensorReadings[i];
            var nextReading = i < sensorReadings.Count - 1 ? sensorReadings[i + 1] : null;

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

        // Add the final segment
        if (currentSegment.Any())
        {
            segmentedReadings.Add(currentSegment);
        }

        // Limit each segment to a maximum of 50 points
        const int maxPoints = 50;
        var limitedSegments = segmentedReadings
            .Select(segment =>
            {
                if (segment.Count > maxPoints)
                {
                    int step = segment.Count / maxPoints;
                    return segment
                        .Where((reading, index) => index % step == 0)
                        .Take(maxPoints)
                        .ToList();
                }
                return segment;
            })
            .ToList();

        return limitedSegments;
    }
}