namespace AirHealthV5.Server.Domain.Models.IDK;

public class LoginResponse
{
    public string Token { get; set; }
    public string FirstDeviceId { get; set; }

    public LoginResponse(string token, string deviceId)
    {
        Token = token;
        FirstDeviceId = deviceId;
    }
}