namespace AirHealthV5.Server.Interfaces;

public interface IUser
{
    public Guid UserId { get; set; }
    public string Username { get; set; }
    public string PasswordHash { get; set; }
    public DateTime Created { get; set; }
}