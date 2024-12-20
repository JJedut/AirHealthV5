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
            TemperatureMin = command.TemperatureMin,
            HumidityMin = command.HumidityMin,
            PressureMin = command.PressureMin,
            GasResistanceMin = command.GasResistanceMin,
            MqTwoMin = command.MqTwoMin,
            Pm1Min = command.Pm1Min,
            Pm25Min = command.Pm25Min,
            Pm10Min = command.Pm10Min,
            
            TemperatureMax = command.TemperatureMax,
            HumidityMax = command.HumidityMax,
            PressureMax = command.PressureMax,
            GasResistanceMax = command.GasResistanceMax,
            MqTwoMax = command.MqTwoMax,
            Pm1Max = command.Pm1Max,
            Pm25Max = command.Pm25Max,
            Pm10Max = command.Pm10Max,
            
            TemperatureMinCritical = command.TemperatureMinCritical,
            HumidityMinCritical = command.HumidityMinCritical,
            PressureMinCritical = command.PressureMinCritical,
            GasResistanceMinCritical = command.GasResistanceMinCritical,
            MqTwoMinCritical = command.MqTwoMinCritical,
            Pm1MinCritical = command.Pm1MinCritical,
            Pm25MinCritical = command.Pm25MinCritical,
            Pm10MinCritical = command.Pm10MinCritical,

            TemperatureMaxCritical = command.TemperatureMaxCritical,
            HumidityMaxCritical = command.HumidityMaxCritical,
            PressureMaxCritical = command.PressureMaxCritical,
            GasResistanceMaxCritical = command.GasResistanceMaxCritical,
            MqTwoMaxCritical = command.MqTwoMaxCritical,
            Pm1MaxCritical = command.Pm1MaxCritical,
            Pm25MaxCritical = command.Pm25MaxCritical,
            Pm10MaxCritical = command.Pm10MaxCritical,
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
            TemperatureMin = device.Thresholds.TemperatureMin,
            HumidityMin = device.Thresholds.HumidityMin,
            PressureMin = device.Thresholds.PressureMin,
            GasResistanceMin = device.Thresholds.GasResistanceMin,
            MqTwoMin = device.Thresholds.MqTwoMin,
            Pm1Min = device.Thresholds.Pm1Min,
            Pm25Min = device.Thresholds.Pm25Min,
            Pm10Min = device.Thresholds.Pm10Min,

            TemperatureMax = device.Thresholds.TemperatureMax,
            HumidityMax = device.Thresholds.HumidityMax,
            PressureMax = device.Thresholds.PressureMax,
            GasResistanceMax = device.Thresholds.GasResistanceMax,
            MqTwoMax = device.Thresholds.MqTwoMax,
            Pm1Max = device.Thresholds.Pm1Max,
            Pm25Max = device.Thresholds.Pm25Max,
            Pm10Max = device.Thresholds.Pm10Max,
            
            TemperatureMinCritical = device.Thresholds.TemperatureMinCritical,
            HumidityMinCritical = device.Thresholds.HumidityMinCritical,
            PressureMinCritical = device.Thresholds.PressureMinCritical,
            GasResistanceMinCritical = device.Thresholds.GasResistanceMinCritical,
            MqTwoMinCritical = device.Thresholds.MqTwoMinCritical,
            Pm1MinCritical = device.Thresholds.Pm1MinCritical,
            Pm25MinCritical = device.Thresholds.Pm25MinCritical,
            Pm10MinCritical = device.Thresholds.Pm10MinCritical,

            TemperatureMaxCritical = device.Thresholds.TemperatureMaxCritical,
            HumidityMaxCritical = device.Thresholds.HumidityMaxCritical,
            PressureMaxCritical = device.Thresholds.PressureMaxCritical,
            GasResistanceMaxCritical = device.Thresholds.GasResistanceMaxCritical,
            MqTwoMaxCritical = device.Thresholds.MqTwoMaxCritical,
            Pm1MaxCritical = device.Thresholds.Pm1MaxCritical,
            Pm25MaxCritical = device.Thresholds.Pm25MaxCritical,
            Pm10MaxCritical = device.Thresholds.Pm10MaxCritical,
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