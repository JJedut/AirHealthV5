using System.Text.Json;
using AirHealthV5.Server.Interfaces;

namespace AirHealthV5.Server.Domain.Models;

public class DeviceReadingModel : IDeviceReading
{
    public int Id { get; set; }
    public string DeviceId { get; set; } = null!;
    public DateTime Timestamp { get; set; }
    public Dictionary<string, float?>? SensorData { get; set; } = new();
    public string? SensorDataJson
    {
        get => JsonSerializer.Serialize(SensorData);
        set => SensorData = string.IsNullOrEmpty(value)
            ? new Dictionary<string, float?>() 
            : JsonSerializer.Deserialize<Dictionary<string, float?>>(value!)!;
    }
}