namespace AirHealthV5.Server.Interfaces;

public interface ITimeWindow
{
    public DateTime? From { get; set; }
    public DateTime? To { get; set; }
}