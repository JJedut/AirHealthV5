using AirHealthV5.Server.Domain.Models;
using AirHealthV5.Server.Interfaces.Repository;
using MediatR;

namespace AirHealthV5.Server.Application.Queries.DeviceQueries;

public class GetDeviceByIdQuery : IRequest<DeviceModel>
{
    public string DeviceId { get; set; } = string.Empty;
}

public class GetDeviceByIdQueryQueryHandler : IRequestHandler<GetDeviceByIdQuery, DeviceModel>
{
    private readonly IDeviceRepository _deviceRepository;

    public GetDeviceByIdQueryQueryHandler(IDeviceRepository deviceRepository)
    {
        _deviceRepository = deviceRepository;
    }

    public async Task<DeviceModel> Handle(GetDeviceByIdQuery request, CancellationToken cancellationToken)
    {
        var devices =  
            await _deviceRepository.GetDeviceById(request.DeviceId, cancellationToken);

        return devices ?? throw new KeyNotFoundException($"Device with id: {request.DeviceId} was not found");
    }
}