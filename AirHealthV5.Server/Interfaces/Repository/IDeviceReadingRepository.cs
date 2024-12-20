
using AirHealthV5.Server.Application.Queries.SensorDataQueries;
using AirHealthV5.Server.Domain.Models;

namespace AirHealthV5.Server.Interfaces.Repository;

public interface IDeviceReadingRepository
{
    public Task<List<DeviceReadingModel>> GetSensorReadingsAsync(SensorDataQuery query,
        CancellationToken cancellationToken);
    public Task<string> SaveSensorReadingAsync(DeviceReadingModel sensorReading,
        CancellationToken cancellationToken);
    public Task<DeviceReadingModel?> GetLatestSensorReading(
        GetLatestReadingQuery query, CancellationToken cancellationToken);
    public Task<List<DeviceReadingModel>> GetSensorTableData(
        GetDataTableQuery query, CancellationToken cancellationToken);
    public Task<int> GetSensorTableDataCount(GetDataTableQuery query, 
        CancellationToken cancellationToken);
}