using AirHealthV5.Server.Interfaces;

namespace AirHealthV5.Server.Domain.Models;

public class ApiKeyModel : IApiKey
{
    public int Id { get; set; }
    public string KeyName { get; set; }
    public Guid KeyId { get; set; }
    public string Key { get; set; }
    public Guid UserId { get; set; }
    public DateTime CreatedOn { get; set; }
    public DateTime? ExpiresOn { get; set; }
    public bool IsActive { get; set; }
}