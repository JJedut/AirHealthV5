using AirHealthV5.Server.Domain.Models;
using AirHealthV5.Server.Interfaces.Repository;
using MediatR;

namespace AirHealthV5.Server.Application.Queries.SensorDataQueries;

public class SensorDataCommand : IRequest<string>
{
    public string ApiKey { get; set; } = null!;
    public Dictionary<string, float?> SensorData { get; set; } = new();
}
public class SensorDataHandler : IRequestHandler<SensorDataCommand, string>
{
    private readonly IDeviceReadingRepository _deviceReadingRepository;
    private readonly IDeviceRepository _deviceRepository;

    public SensorDataHandler(
        IDeviceReadingRepository deviceReadingRepository, 
        IDeviceRepository deviceRepository)
    {
        _deviceReadingRepository = deviceReadingRepository;
        _deviceRepository = deviceRepository;
    }

    public async Task<string> Handle(SensorDataCommand command, CancellationToken cancellationToken)
    {
        
        var device = await _deviceRepository.GetDeviceByApiKey(command.ApiKey, cancellationToken);
        
        if (device == null)
        {
            throw new UnauthorizedAccessException("Invalid API Key");
        }
        
        var response = new DeviceReadingModel()
        {
            DeviceId = device.DeviceId,
            Timestamp = DateTime.UtcNow,
            SensorData = command.SensorData
        };
        
        return await _deviceReadingRepository.SaveSensorReadingAsync(response, cancellationToken);
    }
}