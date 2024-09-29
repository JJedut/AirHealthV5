using AirHealthV5.Server.Command.SensorDataCommand;
using AirHealthV5.Server.Models;
using AirHealthV5.Server.Repository.SensorRepository;
using MediatR;

namespace AirHealthV5.Server.Handler.SensorDataHandler;

public class SensorDataHandler : IRequestHandler<SensorDataCommand, string>
{
    private readonly SensorRepository _sensorRepository;

    public SensorDataHandler(SensorRepository sensorRepository)
    {
        _sensorRepository = sensorRepository;
    }

    public async Task<string> Handle(SensorDataCommand command, CancellationToken cancellationToken)
    {
        Console.WriteLine("command.Value: "+command.Value);
        var response = new SensorReadingModel()
        {
            Value = command.Value,
            Timestamp = DateTime.UtcNow
        };
        
        Console.WriteLine("response: "+response.Timestamp + " : " + response.Value);
        
        return await _sensorRepository.SaveSensorReadingAsync(response, cancellationToken);
    }
}