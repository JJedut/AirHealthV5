namespace AirHealthV5.Server.Interfaces;

public interface IDeviceReading
{
    public int Id { get; set; }
    
    public string DeviceId { get; set; }
    public float? MqTwo { get; set; }
    public float? Temperature { get; set; }
    public float? Humidity { get; set; }
    public float? Pressure { get; set; }
    public float? GasResistance { get; set; }
    public float? Pm1 { get; set; }
    public float? Pm25 { get; set; }
    public float? Pm10 { get; set; }
    public DateTime Timestamp { get; set; }
}