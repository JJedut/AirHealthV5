using AirHealthV5.Server.Domain.Models;
using AirHealthV5.Server.Interfaces.Repository;
using MediatR;

namespace AirHealthV5.Server.Application.Commands.DeviceCommands;

public class SetThresholdCommand : IRequest<bool>
{
    public string DeviceId { get; set; } = null!;

    public Dictionary<string, ThresholdsValue> SensorThresholds { get; set; } = new();
}

public class SetThresholdCommandHandler : IRequestHandler<SetThresholdCommand, bool>
{
    private readonly IDeviceRepository _deviceRepository;

    public SetThresholdCommandHandler(IDeviceRepository deviceRepository)
    {
        _deviceRepository = deviceRepository;
    }
    
    public async Task<bool> Handle(SetThresholdCommand request, CancellationToken cancellationToken)
    {
        return await _deviceRepository.SetThresholds(request, cancellationToken);
    }
}