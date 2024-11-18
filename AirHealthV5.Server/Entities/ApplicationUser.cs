using Microsoft.AspNetCore.Identity;

namespace AirHealthV5.Server.Entities;

public class ApplicationUser : IdentityUser
{
    public string FullName { get; set; }
}