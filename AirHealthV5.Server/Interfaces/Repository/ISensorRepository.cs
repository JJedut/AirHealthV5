using AirHealthV5.Server.Models;

namespace AirHealthV5.Server.Interfaces.Repository;

public interface ISensorRepository
{
    public Task<List<SensorReadingModel>> GetSensorReadingsAsync(DateTime from, DateTime to,
        CancellationToken cancellationToken);
    public Task<string> SaveSensorReadingAsync(SensorReadingModel sensorReading,
        CancellationToken cancellationToken);
}