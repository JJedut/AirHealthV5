using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using AirHealthV5.Server.Domain.Models;
using Microsoft.IdentityModel.Tokens;

namespace AirHealthV5.Server.Infrastructure.Services;

public class JwtTokenService
{
    private readonly IConfiguration _configuration;

    public JwtTokenService(IConfiguration configuration)
    {
        _configuration = configuration;
        Console.WriteLine("SecretKey: " + _configuration["JwtSettings:Key"]);
        Console.WriteLine("Issuer: " + _configuration["JwtSettings:Issuer"]);
        Console.WriteLine("Audience: " + _configuration["JwtSettings:Audience"]);
    }

    public string GenerateJwtToken(UserModel user)
    {
        var claims = new[]
        {
            new Claim(JwtRegisteredClaimNames.Sub, user.Username),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
            new Claim("userId", user.UserId.ToString()), // You can add custom claims here
            new Claim("isAdmin", user.IsAdmin.ToString())
        };

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["JwtSettings:Key"]));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            issuer: _configuration["JwtSettings:Issuer"],
            audience: _configuration["JwtSettings:Audience"],
            claims: claims,
            expires: DateTime.Now.AddDays(1),
            signingCredentials: creds
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}