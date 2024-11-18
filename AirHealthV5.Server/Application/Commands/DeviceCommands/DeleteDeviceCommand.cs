using AirHealthV5.Server.Interfaces.Repository;
using MediatR;

namespace AirHealthV5.Server.Application.Commands.DeviceCommands;

public class DeleteDeviceCommand : IRequest<bool>
{
    public string DeviceId { get; set; } = null!;
}

public class DeleteDeviceCommandHandler : IRequestHandler<DeleteDeviceCommand, bool>
{
    private readonly IDeviceRepository _deviceRepository;

    public DeleteDeviceCommandHandler(IDeviceRepository deviceRepository)
    {
        _deviceRepository = deviceRepository;
    }

    public async Task<bool> Handle(DeleteDeviceCommand request, CancellationToken cancellationToken)
    {
        return await _deviceRepository.DeleteDevice(request.DeviceId, cancellationToken);
    }
}