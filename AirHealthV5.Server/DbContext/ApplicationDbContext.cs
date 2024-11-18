using AirHealthV5.Server.Domain.Models;
using Microsoft.EntityFrameworkCore;

namespace AirHealthV5.Server.DbContext;

public class ApplicationDbContext : Microsoft.EntityFrameworkCore.DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) 
        : base(options) 
    { 
    }

    public DbSet<DeviceReadingModel> DeviceReadings { get; set; }
    public DbSet<DeviceModel> Devices { get; set; }
    public DbSet<UserModel> Users { get; set; }
    public DbSet<ApiKeyModel> ApiKeys { get; set; }
    
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<UserModel>()
            .HasKey(u => u.Id); // Primary Key
        modelBuilder.Entity<UserModel>()
            .HasAlternateKey(u => u.UserId); // Alternate Key for relationships

        modelBuilder.Entity<DeviceModel>()
            .HasOne(d => d.User)
            .WithMany(u => u.Devices)
            .HasForeignKey(d => d.UserId)
            .HasPrincipalKey(u => u.UserId) // Use UserId as the principal key
            .OnDelete(DeleteBehavior.Cascade);

        base.OnModelCreating(modelBuilder);
    }

}