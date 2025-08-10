using AirHealthV5.Server.Domain.Models;
using AirHealthV5.Server.Domain.Models.DTO;

namespace AirHealthV5.Server.Helpers;

public static class DeviceReadingMapper
{
    public static DeviceReadingDto ToDto(this DeviceReadingModel model)
    {
        return new DeviceReadingDto
        {
            Id = model.Id,
            DeviceId = model.DeviceId,
            Timestamp = model.Timestamp,
            SensorData = model.SensorData ?? new Dictionary<string, float?>()
        };
    }
}
