using AirHealthV5.Server.Models;
using Microsoft.EntityFrameworkCore;

namespace AirHealthV5.Server.DbContext;

public class ApplicationDbContext : Microsoft.EntityFrameworkCore.DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) 
        : base(options) 
    { 
    }

    public DbSet<SensorReadingModel> SensorReadings { get; set; }
}