using AirHealthV5.Server.Application.Commands.DeviceCommands;
using AirHealthV5.Server.Domain.Models;

namespace AirHealthV5.Server.Interfaces.Repository;

public interface IDeviceRepository
{
    public Task<bool> AddDevice(DeviceModel device, 
        CancellationToken cancellationToken);
    public Task<List<DeviceModel>> GetDevicesByUserId(Guid userId,
        CancellationToken cancellationToken);

    public Task<DeviceModel?> GetDeviceById(string deviceId,
        CancellationToken cancellationToken);
    public Task<bool> DeleteDevice(string deviceId, 
        CancellationToken cancellationToken);
    public Task<bool> SaveSensorOrder(SaveSensorOrderCommand command, 
        CancellationToken cancellationToken);

    public Task<List<int>> GetSensorOrder(string deviceId, 
        CancellationToken cancellationToken);
}