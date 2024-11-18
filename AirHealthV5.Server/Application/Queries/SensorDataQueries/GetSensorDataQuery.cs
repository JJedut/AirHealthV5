using AirHealthV5.Server.Domain.Models;
using AirHealthV5.Server.Interfaces.Repository;
using MediatR;

namespace AirHealthV5.Server.Application.Queries.SensorDataQueries;

public class SensorDataQuery : IRequest<List<DeviceReadingModel>>
{
    public DateTime? From { get; set; }
    public DateTime? To { get; set; }
    public Guid DeviceId { get; set; }
}
public class GetSensorDataQuery : IRequestHandler<SensorDataQuery, List<DeviceReadingModel>>
{
    IDeviceReadingRepository _deviceReadingRepository;

    public GetSensorDataQuery(IDeviceReadingRepository deviceReadingRepository)
    {
        _deviceReadingRepository = deviceReadingRepository;
    }

    public async Task<List<DeviceReadingModel>> Handle(SensorDataQuery request, CancellationToken cancellationToken)
    {
        // Validate request
        if (request.From == null || request.To == null || request.From > request.To)
        {
            throw new ArgumentException("Invalid time window request");
        }

        // Fetch raw sensor readings from repository
        var sensorReadings = await _deviceReadingRepository.GetSensorReadingsAsync(request, cancellationToken);

        // Filter readings by DeviceId
        var filteredReadings = sensorReadings
            .Where(sr => sr.DeviceId == request.DeviceId.ToString())
            .ToList();

        // If no data is found for the given DeviceId, return an empty list
        if (!filteredReadings.Any())
            return new List<DeviceReadingModel>();

        // Limit the number of points to a maximum of 500
        const int maxPoints = 50;
        if (filteredReadings.Count > maxPoints)
        {
            int step = filteredReadings.Count / maxPoints;
            filteredReadings = filteredReadings
                .Where((sr, index) => index % step == 0)
                .Take(maxPoints) // Ensure we don't accidentally overshoot 500 points
                .ToList();
        }

        // Map filtered and subsampled data to DeviceReadingModel
        var result = filteredReadings.Select(sr => new DeviceReadingModel
        {
            Id = sr.Id,
            DeviceId = sr.DeviceId,
            MqTwo = sr.MqTwo,
            Temperature = sr.Temperature,
            Humidity = sr.Humidity,
            Pressure = sr.Pressure,
            GasResistance = sr.GasResistance,
            Pm1 = sr.Pm1,
            Pm25 = sr.Pm25,
            Pm10 = sr.Pm10,
            Timestamp = sr.Timestamp
        }).ToList();

        return result;
    }
}