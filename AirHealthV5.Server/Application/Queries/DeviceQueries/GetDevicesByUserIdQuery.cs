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
        
        foreach (var device in devices)
        {
            if (device.Thresholds == null)
            {
                device.Thresholds = new ThresholdsModel
                {
                    TemperatureMin = null,
                    HumidityMin = null,
                    PressureMin = null,
                    GasResistanceMin = null,
                    MqTwoMin = null,
                    Pm1Min = null,
                    Pm25Min = null,
                    Pm10Min = null,
                    TemperatureMax = null,
                    HumidityMax = null,
                    PressureMax = null,
                    GasResistanceMax = null,
                    MqTwoMax = null,
                    Pm1Max = null,
                    Pm25Max = null,
                    Pm10Max = null,
                    TemperatureMinCritical = null,
                    HumidityMinCritical = null,
                    PressureMinCritical = null,
                    GasResistanceMinCritical = null,
                    MqTwoMinCritical = null,
                    Pm1MinCritical = null,
                    Pm25MinCritical = null,
                    Pm10MinCritical = null,
                    TemperatureMaxCritical = null,
                    HumidityMaxCritical = null,
                    PressureMaxCritical = null,
                    GasResistanceMaxCritical = null,
                    MqTwoMaxCritical = null,
                    Pm1MaxCritical = null,
                    Pm25MaxCritical = null,
                    Pm10MaxCritical = null
                };
            }
        }

        return devices;
    }
}