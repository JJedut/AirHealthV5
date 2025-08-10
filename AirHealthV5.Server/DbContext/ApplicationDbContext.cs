using System.Text.Json;
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
            .HasKey(u => u.Id);
        modelBuilder.Entity<UserModel>()
            .HasAlternateKey(u => u.UserId);

        modelBuilder.Entity<DeviceReadingModel>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Ignore(e => e.SensorData);
            entity.Property(e => e.SensorDataJson)
                .HasColumnName("SensorData")
                .HasColumnType("nvarchar(max)");
        });

        modelBuilder.Entity<DeviceModel>()
            .HasOne(d => d.User)
            .WithMany(u => u.Devices)
            .HasForeignKey(d => d.UserId)
            .HasPrincipalKey(u => u.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<DeviceModel>()
            .OwnsOne(d => d.Thresholds, tb =>
            {
                tb.Property(t => t.SensorThresholds)
                    .HasConversion(
                        v => JsonSerializer.Serialize(v, (JsonSerializerOptions)null),
                        v => string.IsNullOrEmpty(v) 
                            ? new Dictionary<string, ThresholdsValue>() 
                            : JsonSerializer.Deserialize<Dictionary<string, ThresholdsValue>>(v, (JsonSerializerOptions)null))
                    .HasColumnName("SensorThresholdsJson");
            });


        base.OnModelCreating(modelBuilder);
    }
}