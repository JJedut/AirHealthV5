namespace AirHealthV5.Server.Interfaces;

public interface IMultiSensor
{
    public int Id { get; set; }
    public int? Temperature { get; set; }
    public int? Moisture { get; set; }
    public int? Pressure { get; set; }
    public int? ParticulateMatter { get; set; }
    public int? MqTwo { get; set; }
    public DateTime Timestamp { get; set; }
    public Guid DeviceId { get; set; }
}