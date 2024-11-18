using AirHealthV5.Server.Application.Queries.SensorDataQueries;
using AirHealthV5.Server.DbContext;
using AirHealthV5.Server.Domain.Models;
using AirHealthV5.Server.Interfaces.Repository;
using Microsoft.EntityFrameworkCore;

namespace AirHealthV5.Server.Infrastructure.Repositories;

public class DeviceReadingRepository : IDeviceReadingRepository
{
    private readonly ApplicationDbContext _context;

    public DeviceReadingRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<DeviceReadingModel>> GetSensorReadingsAsync(SensorDataQuery query, CancellationToken cancellationToken)
    {
        return await _context.DeviceReadings
            .Where(sr => sr.Timestamp >= query.From && sr.Timestamp <= query.To && sr.DeviceId == query.DeviceId.ToString())
            .OrderBy(sr => sr.Timestamp)
            .ToListAsync(cancellationToken);
    }

    public async Task<DeviceReadingModel?> GetLatestSensorReading(GetLatestReadingQuery query, CancellationToken cancellationToken)
    {
        return await _context.DeviceReadings
            .AsNoTracking()
            .Where(x => x.DeviceId == query.DeviceId.ToString())
            .OrderByDescending(sr => sr.Timestamp)
            .FirstOrDefaultAsync(cancellationToken);
    }
    
    public async Task<string> SaveSensorReadingAsync(DeviceReadingModel sensorReading, CancellationToken cancellationToken)
    {
        _context.DeviceReadings.Add(sensorReading);

        await _context.SaveChangesAsync(cancellationToken);

        return sensorReading.Id.ToString();
    }
}