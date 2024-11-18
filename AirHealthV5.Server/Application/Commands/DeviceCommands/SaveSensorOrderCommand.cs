using AirHealthV5.Server.Interfaces.Repository;
using MediatR;

namespace AirHealthV5.Server.Application.Commands.DeviceCommands;

public class SaveSensorOrderCommand : IRequest<bool>
{
    public string DeviceId { get; set; }
    public List<int> SensorOrder { get; set; }
}

public class SaveSensorOrderCommandHandler : IRequestHandler<SaveSensorOrderCommand, bool>
{
    private readonly IDeviceRepository _deviceRepository;

    public SaveSensorOrderCommandHandler(IDeviceRepository deviceRepository)
    {
        _deviceRepository = deviceRepository;
    }

    public async Task<bool> Handle(SaveSensorOrderCommand request, CancellationToken cancellationToken)
    {
        return await _deviceRepository.SaveSensorOrder(request, cancellationToken);
    }
}