using AirHealthV5.Server.DbContext;
using AirHealthV5.Server.Interfaces.Repository;
using AirHealthV5.Server.Models;
using Microsoft.EntityFrameworkCore;

namespace AirHealthV5.Server.Repository.SensorRepository;

public class SensorRepository : ISensorRepository
{
    private readonly ApplicationDbContext _context;

    public SensorRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<SensorReadingModel>> GetSensorReadingsAsync(DateTime from, DateTime to, CancellationToken cancellationToken)
    {
        return await _context.SensorReadings
            .Where(sr => sr.Timestamp >= from && sr.Timestamp <= to)
            .OrderBy(sr => sr.Timestamp)
            .ToListAsync(cancellationToken);
    }
    
    public async Task<string> SaveSensorReadingAsync(SensorReadingModel sensorReading, CancellationToken cancellationToken)
    {
        _context.SensorReadings.Add(sensorReading);

        await _context.SaveChangesAsync(cancellationToken);

        return sensorReading.Id.ToString();
    }
}