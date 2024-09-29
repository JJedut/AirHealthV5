namespace AirHealthV5.Server.Interfaces;

public interface ISensorReading
{
    public int Id { get; set; }
    public string? Value { get; set; }
    public DateTime Timestamp { get; set; }
}