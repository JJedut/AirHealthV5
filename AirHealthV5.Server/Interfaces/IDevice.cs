namespace AirHealthV5.Server.Interfaces;

public interface IDevice
{
    public string DeviceId { get; set; }
    public string DeviceName { get; set; }
    public string ApiKey { get; set; }
    public Guid UserId { get; set; }
    public bool IsActive { get; set; }
    public DateTime LastUpdate { get; set; }
    public DateTime Created { get; set; }
    public int[] SensorOrder { get; set; }
}