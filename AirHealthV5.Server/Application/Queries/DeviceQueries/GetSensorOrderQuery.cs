using AirHealthV5.Server.Interfaces.Repository;
using MediatR;

namespace AirHealthV5.Server.Application.Queries.DeviceQueries;

public class GetSensorOrderQuery : IRequest<List<int>>
{
    public string DeviceId { get; set; }
}
public class GetSensorOrderQueryHandler : IRequestHandler<GetSensorOrderQuery, List<int>>
{
    private readonly IDeviceRepository _deviceRepository;

    public GetSensorOrderQueryHandler(IDeviceRepository deviceRepository)
    {
        _deviceRepository = deviceRepository;
    }

    public async Task<List<int>> Handle(GetSensorOrderQuery request, CancellationToken cancellationToken)
    {
        if (request.DeviceId == String.Empty)
            throw new ArgumentException("DeviceId cannot be empty.", nameof(request.DeviceId));

        var sensorOrder = await _deviceRepository.GetSensorOrder(request.DeviceId, cancellationToken);

        return sensorOrder;
    }
}
