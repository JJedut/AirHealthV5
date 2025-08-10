using AirHealthV5.Server.Application.Commands.DeviceCommands;
using AirHealthV5.Server.DbContext;
using AirHealthV5.Server.Domain.Models;
using AirHealthV5.Server.Interfaces.Repository;
using Microsoft.EntityFrameworkCore;

namespace AirHealthV5.Server.Infrastructure.Repositories;

public class DevicesRepository : IDeviceRepository
{
    private readonly ApplicationDbContext _context;

    public DevicesRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<bool> AddDevice(DeviceModel device, CancellationToken cancellationToken)
    {
        await _context.Devices.AddAsync(device, cancellationToken);
        
        var result = await _context.SaveChangesAsync(cancellationToken) > 0;
        
        return result;
    }

    public async Task<List<DeviceModel>> GetDevicesByUserId(Guid userId, CancellationToken cancellationToken)
    {
        return await _context.Devices
            .Where(x => x.UserId == userId)
            .ToListAsync(cancellationToken);
    }

    public async Task<DeviceModel?> GetDeviceById(string deviceId, CancellationToken cancellationToken)
    {
        return await _context.Devices
            .Where(x => x.DeviceId == deviceId)
            .FirstOrDefaultAsync(cancellationToken);
    }

    public async Task<bool> DeleteDevice(string deviceId, CancellationToken cancellationToken)
    {
        var device = await _context.Devices
            .FirstOrDefaultAsync(x => x.DeviceId == deviceId, cancellationToken);

        if (device == null)
            return false;

        _context.Devices.Remove(device);
        await _context.SaveChangesAsync(cancellationToken);
        
        return true;
    }
    
    public async Task<bool> SaveSensorOrder(SaveSensorOrderCommand command, CancellationToken cancellationToken)
    {
        if (command.SensorOrder == null || !command.SensorOrder.Any())
            throw new ArgumentException("SensorOrder cannot be null or empty.", nameof(command.SensorOrder));

        var device = await _context.Devices
            .FirstOrDefaultAsync(x => x.DeviceId == command.DeviceId, cancellationToken);

        if (device == null)
            throw new KeyNotFoundException($"Device with ID {command.DeviceId} not found.");

        device.SensorOrder = command.SensorOrder.ToArray();

        _context.Devices.Update(device);

        var result = await _context.SaveChangesAsync(cancellationToken);
        return result > 0;
    }

    public async Task<List<int>> GetSensorOrder(string deviceId, CancellationToken cancellationToken)
    {
        var sensorOrders = await _context.Devices
            .Where(x => x.DeviceId == deviceId)
            .Select(x => x.SensorOrder)
            .FirstOrDefaultAsync(cancellationToken);
        
        return sensorOrders?.ToList() ?? new List<int>();
    }

    public async Task<bool> SetThresholds(SetThresholdCommand command, CancellationToken cancellationToken)
    {
        var device = await _context.Devices
            .FirstOrDefaultAsync(x => x.DeviceId == command.DeviceId, cancellationToken);

        if (device == null)
        {
            return false;
        }

        device.Thresholds = new ThresholdsModel
        {
            SensorThresholds = command.SensorThresholds
        };
        
        await _context.SaveChangesAsync(cancellationToken);
        return true;
    }

    public async Task<ThresholdsModel?> GetThresholds(string deviceId, CancellationToken cancellationToken)
    {
        var device = await _context.Devices
            .Include(x => x.Thresholds)
            .FirstOrDefaultAsync(x => x.DeviceId == deviceId, cancellationToken);

        if (device == null)
        {
            return null;
        }

        return new ThresholdsModel
        {
            SensorThresholds = device.Thresholds!.SensorThresholds
        };
    }

    public async Task<DeviceModel> GetDeviceByApiKey(string apiKey, CancellationToken cancellationToken)
    {
        var device = await _context.Devices.FirstOrDefaultAsync(x => x.ApiKey == apiKey, cancellationToken);
        
        if (device == null)
        {
            return null;
        }

        return device;
    }
}