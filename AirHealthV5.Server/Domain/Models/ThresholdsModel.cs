using AirHealthV5.Server.Interfaces;

namespace AirHealthV5.Server.Domain.Models;

public class ThresholdsValue
{
    public float? Min { get; set; }
    public float? Max { get; set; }
    public float? MinCritical { get; set; }
    public float? MaxCritical { get; set; }
}
public class ThresholdsModel
{
    public Dictionary<string, ThresholdsValue> SensorThresholds { get; set; } = new();
}
