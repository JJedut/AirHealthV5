using AirHealthV5.Server.Models;
using AirHealthV5.Server.Query.SensorDataQuery;
using AirHealthV5.Server.Repository.SensorRepository;
using MediatR;

namespace AirHealthV5.Server.Handler.SensorDataHandler;

public class GetSensorDataHandler : IRequestHandler<SensorDataQuery, List<SensorReadingModel>>
{
    SensorRepository _sensorRepository;

    public GetSensorDataHandler(SensorRepository sensorRepository)
    {
        _sensorRepository = sensorRepository;
    }

    public async Task<List<SensorReadingModel>> Handle(SensorDataQuery request, CancellationToken cancellationToken)
    {
        if (request.From == null || request.To == null || request.From > request.To)
        {
            throw new ArgumentException("Invalid time window request");
        }
        
        var sensorReadings = 
            await _sensorRepository.GetSensorReadingsAsync(request.From.Value, request.To.Value, cancellationToken);

        return sensorReadings.Select(sr => new SensorReadingModel
        {
            Id = sr.Id,
            Value = sr.Value,
            Timestamp = sr.Timestamp
        }).ToList();
    }
}