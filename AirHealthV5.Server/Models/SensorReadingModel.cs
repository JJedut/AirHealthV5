using AirHealthV5.Server.Interfaces;

namespace AirHealthV5.Server.Models;

public class SensorReadingModel : ISensorReading
{
    public int Id { get; set; }
    public string? Value { get; set; }
    public DateTime Timestamp { get; set; }
}