using AirHealthV5.Server.Domain.Models;
using AirHealthV5.Server.Interfaces.Repository;
using MediatR;

namespace AirHealthV5.Server.Application.Queries.DeviceQueries;

public class GetThresholdsQuery : IRequest<ThresholdsModel>
{
    public string DeviceId { get; set; } = null!;
}

public class GetThresholdsQueryHandler : IRequestHandler<GetThresholdsQuery, ThresholdsModel>
{
    private readonly IDeviceRepository _deviceRepository;

    public GetThresholdsQueryHandler(IDeviceRepository deviceRepository)
    {
        _deviceRepository = deviceRepository;
    }

    public Task<ThresholdsModel?> Handle(GetThresholdsQuery request, CancellationToken cancellationToken)
    {
        return _deviceRepository.GetThresholds(request.DeviceId, cancellationToken);
    }
}