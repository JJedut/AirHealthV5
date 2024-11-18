using System.Security.Cryptography;
using System.Text;
using AirHealthV5.Server.DbContext;
using AirHealthV5.Server.Domain.Models;
using AirHealthV5.Server.Helpers;
using Microsoft.EntityFrameworkCore;

namespace AirHealthV5.Server.Entities;

public class AdminSeeder
{
    private readonly ApplicationDbContext _context;

    public AdminSeeder(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task SeedAdminUserAsync(CancellationToken cancellationToken = default)
    {
        if (await _context.Users.AnyAsync(x => x.IsAdmin, cancellationToken))
        {
            return;
        }

        var adminUser = new UserModel
        {
            UserId = Guid.NewGuid(),
            Username = "admin",
            PasswordHash = PasswordHelper.HashPassword("Admin123!"),
            Created = DateTime.UtcNow,
            IsAdmin = true,
        };
        
        _context.Users.Add(adminUser);
        await _context.SaveChangesAsync(cancellationToken);
    }
}