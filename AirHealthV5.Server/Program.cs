using System.Text;
using AirHealthV5.Server.DbContext;
using AirHealthV5.Server.Entities;
using AirHealthV5.Server.Infrastructure.Repositories;
using AirHealthV5.Server.Infrastructure.Services;
using AirHealthV5.Server.Interfaces.Repository;
using AirHealthV5.Server.Middleware;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;

var builder = WebApplication.CreateBuilder(args);
var config = builder.Configuration;
var services = builder.Services;

builder.Logging.ClearProviders();
builder.Logging.AddConsole();
builder.Logging.AddDebug();

services.AddCors(options =>
{
    options.AddPolicy("AllowSpecificOrigins", policy =>
    {
        policy.WithOrigins(
                "http://localhost:4200", 
                "https://192.168.33.105:7096", 
                "https://127.0.0.1:4200"
                )
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
    });
});

services.AddControllers();

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
services.AddEndpointsApiExplorer();
services.AddSwaggerGen();

services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = config["JwtSettings:Issuer"],
            ValidAudience = config["JwtSettings:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(config["JwtSettings:Key"]!))
        };
    });

services.AddAuthorization();
services.AddMediatR(cfg => cfg.RegisterServicesFromAssemblies(typeof(Program).Assembly));

services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(config.GetConnectionString("DefaultConnection")));

services.AddTransient<IDeviceReadingRepository, DeviceReadingRepository>();
services.AddTransient<IDeviceRepository, DevicesRepository>();
services.AddTransient<IAuthRepository, AuthRepository>();
services.AddTransient<IUserRepository, UserRepository>();

services.AddSingleton<JwtTokenService>();
services.AddSingleton<IHttpContextAccessor, HttpContextAccessor>();
services.AddScoped<ApiKeyService>();

services.AddTransient<AdminSeeder>();
//services.AddTransient<ApiKeyMiddleware>();

var app = builder.Build();

app.UseCors("AllowSpecificOrigins");
app.UseDefaultFiles();
app.UseStaticFiles();

//app.UseMiddleware<ApiKeyMiddleware>();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

//app.UseHttpsRedirection();

app.UseAuthentication();

app.UseAuthorization();

app.MapControllers();

app.MapFallbackToFile("/index.html");

using (var scope = app.Services.CreateScope())
{
    var serviceProvider = scope.ServiceProvider;
    var adminSeeder = serviceProvider.GetRequiredService<AdminSeeder>();
    await adminSeeder.SeedAdminUserAsync();
}

app.Run();
