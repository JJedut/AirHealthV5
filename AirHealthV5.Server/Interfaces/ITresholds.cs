namespace AirHealthV5.Server.Interfaces;

public interface ITresholds
{
    public int? TemperatureMin { get; set; }
    public int? HumidityMin { get; set; }
    public int? PressureMin { get; set; }
    public int? GasResistanceMin { get; set; }
    public int? MqTwoMin { get; set; }
    public int? Pm1Min { get; set; }
    public int? Pm25Min { get; set; }
    public int? Pm10Min { get; set; }
    public int? TemperatureMax { get; set; }
    public int? HumidityMax { get; set; }
    public int? PressureMax { get; set; }
    public int? GasResistanceMax { get; set; }
    public int? MqTwoMax { get; set; }
    public int? Pm1Max { get; set; }
    public int? Pm25Max { get; set; }
    public int? Pm10Max { get; set; }
    public int? TemperatureMinCritical { get; set; }
    public int? HumidityMinCritical { get; set; }
    public int? PressureMinCritical { get; set; }
    public int? GasResistanceMinCritical { get; set; }
    public int? MqTwoMinCritical { get; set; }
    public int? Pm1MinCritical { get; set; }
    public int? Pm25MinCritical { get; set; }
    public int? Pm10MinCritical { get; set; }
    public int? TemperatureMaxCritical { get; set; }
    public int? HumidityMaxCritical { get; set; }
    public int? PressureMaxCritical { get; set; }
    public int? GasResistanceMaxCritical { get; set; }
    public int? MqTwoMaxCritical { get; set; }
    public int? Pm1MaxCritical { get; set; }
    public int? Pm25MaxCritical { get; set; }
    public int? Pm10MaxCritical { get; set; }
}