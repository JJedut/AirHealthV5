using AirHealthV5.Server.Domain.Models;
using AirHealthV5.Server.Interfaces.Repository;
using MediatR;

namespace AirHealthV5.Server.Application.Queries.SensorDataQueries;

public class GetLatestReadingQuery : IRequest<DeviceReadingModel?>
{
    public Guid DeviceId { get; set; }
}
public class GetLatestReadingQueryHandler : IRequestHandler<GetLatestReadingQuery, DeviceReadingModel?>
{
    private readonly IDeviceReadingRepository _deviceReadingRepository;
    
    public GetLatestReadingQueryHandler(IDeviceReadingRepository deviceReadingRepository)
    {
        _deviceReadingRepository = deviceReadingRepository;
    }

    public async Task<DeviceReadingModel?> Handle(GetLatestReadingQuery request, CancellationToken cancellationToken)
    {
        var latestReading = await _deviceReadingRepository.GetLatestSensorReading(request, cancellationToken);
            
        return latestReading;
    }
}