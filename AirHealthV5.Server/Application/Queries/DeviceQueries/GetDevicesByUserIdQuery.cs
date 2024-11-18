using AirHealthV5.Server.Domain.Models;
using AirHealthV5.Server.Interfaces.Repository;
using MediatR;

namespace AirHealthV5.Server.Application.Queries.DeviceQueries;

public class GetDevicesByUserIdQuery : IRequest<List<DeviceModel>>
{
    public Guid UserId { get; set; }
}

public class GetDevicesByUserIdQueryHandler : IRequestHandler<GetDevicesByUserIdQuery, List<DeviceModel>>
{
    private readonly IDeviceRepository _deviceRepository;

    public GetDevicesByUserIdQueryHandler(IDeviceRepository deviceRepository)
    {
        _deviceRepository = deviceRepository;
    }

    public async Task<List<DeviceModel>> Handle(GetDevicesByUserIdQuery request, CancellationToken cancellationToken)
    {
        var devices =  
            await _deviceRepository.GetDevicesByUserId(request.UserId, cancellationToken);

        return devices;
    }
}