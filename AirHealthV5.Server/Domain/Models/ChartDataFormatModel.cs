namespace AirHealthV5.Server.Domain.Models;

public class ChartDataFormatModel
{
    public string DeviceId { get; set; }
    public List<List<DateTime>> Timestamp { get; set; }
    public Dictionary<string, List<List<double>>> SensorReadings { get; set; } = new();
}