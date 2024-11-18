using AirHealthV5.Server.Interfaces;

namespace AirHealthV5.Server.Domain.Models;

public class UserModel : IUser
{
    public int Id { get; set; }
    public Guid UserId { get; set; }
    public string Username { get; set; }
    public string PasswordHash { get; set; }
    public DateTime Created { get; set; }
    public bool IsAdmin { get; set; }
    public ICollection<DeviceModel> Devices { get; set; } = new List<DeviceModel>();
}