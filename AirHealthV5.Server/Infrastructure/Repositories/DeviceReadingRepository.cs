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

    public async Task<List<DeviceReadingModel>> GetSensorReadingsAsync(SensorDataChartQuery chartQuery,
        CancellationToken cancellationToken)
    {
        return await _context.DeviceReadings
            .Where(sr => sr.Timestamp >= chartQuery.From && sr.Timestamp <= chartQuery.To && sr.DeviceId == chartQuery.DeviceId.ToString())
            .OrderBy(sr => sr.Timestamp)
            .ToListAsync(cancellationToken);
    }
    
    public async Task<List<DeviceReadingModel>> GetSensorTableData(GetDataTableQuery query, 
        CancellationToken cancellationToken)
    {
        int pageNumber = query.PageNumber ?? 1;
        int pageSize = query.PageSize ?? 100;
        
        int skip = (pageNumber - 1) * pageSize;
        
        return await _context.DeviceReadings
            .Where(sr => 
                sr.Timestamp >= query.From 
                && sr.Timestamp <= query.To 
                && sr.DeviceId == query.DeviceId.ToString())
            .OrderBy(sr => sr.Timestamp)
            .Skip(skip)
            .Take(pageSize)
            .ToListAsync(cancellationToken);
    }
    
    public async Task<int> GetSensorTableDataCount(GetDataTableQuery query, CancellationToken cancellationToken)
    {
        return await _context.DeviceReadings
            .Where(sr =>
                sr.Timestamp >= query.From
                && sr.Timestamp <= query.To
                && sr.DeviceId == query.DeviceId.ToString())
            .CountAsync(cancellationToken);
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