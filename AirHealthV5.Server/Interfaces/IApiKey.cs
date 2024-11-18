namespace AirHealthV5.Server.Interfaces;

public interface IApiKey
{
    public int Id { get; set; }
    public Guid KeyId { get; set; }
    public string Key { get; set; }
    public Guid UserId { get; set; }
    public DateTime CreatedOn { get; set; }
    public DateTime? ExpiresOn { get; set; }
    public bool IsActive { get; set; }
}