using AirHealthV5.Server.Domain.Models;
using AirHealthV5.Server.Interfaces.Repository;
using MediatR;

namespace AirHealthV5.Server.Application.Queries.SensorDataQueries;

public class SensorDataCommand : IRequest<string>
{
    public string DeviceId { get; set; } = null!;
    public float? MqTwo { get; set; }
    public float? Temperature { get; set; }
    public float? Humidity { get; set; }
    public float? Pressure { get; set; }
    public float? GasResistance { get; set; }
    
    public float? Pm1 { get; set; }
    public float? Pm25 { get; set; }
    public float? Pm10 { get; set; }
}
public class SensorDataHandler : IRequestHandler<SensorDataCommand, string>
{
    private readonly IDeviceReadingRepository _deviceReadingRepository;

    public SensorDataHandler(IDeviceReadingRepository deviceReadingRepository)
    {
        _deviceReadingRepository = deviceReadingRepository;
    }

    public async Task<string> Handle(SensorDataCommand command, CancellationToken cancellationToken)
    {
        Console.WriteLine($"Pm1: {command.Pm1}");
        var response = new DeviceReadingModel()
        {
            DeviceId = command.DeviceId,
            MqTwo = command.MqTwo,
            Temperature = command.Temperature,
            Humidity = command.Humidity,
            Pressure = command.Pressure,
            GasResistance = command.GasResistance,
            Pm1 = command.Pm1,
            Pm25 = command.Pm25,
            Pm10 = command.Pm10,
            Timestamp = DateTime.UtcNow
        };
        
        return await _deviceReadingRepository.SaveSensorReadingAsync(response, cancellationToken);
    }
}