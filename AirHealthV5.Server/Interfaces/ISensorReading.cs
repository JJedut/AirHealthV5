using System.Text.Json;

namespace AirHealthV5.Server.Interfaces;

public interface IDeviceReading
{
    public int Id { get; set; }
    public string DeviceId { get; set; }
    public DateTime Timestamp { get; set; }
    public Dictionary<string, float?>? SensorData { get; set; }
    public string? SensorDataJson
    {
        get => JsonSerializer.Serialize(SensorData);
        set => SensorData = string.IsNullOrEmpty(value)
            ? new Dictionary<string, float?>() 
            : JsonSerializer.Deserialize<Dictionary<string, float?>>(value!)!;
    }
}