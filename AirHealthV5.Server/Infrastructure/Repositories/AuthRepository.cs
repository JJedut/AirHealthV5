using AirHealthV5.Server.Application.Commands.AuthCommands;
using AirHealthV5.Server.DbContext;
using AirHealthV5.Server.Domain.Models;
using AirHealthV5.Server.Domain.Models.IDK;
using AirHealthV5.Server.Helpers;
using AirHealthV5.Server.Infrastructure.Services;
using AirHealthV5.Server.Interfaces.Repository;
using Microsoft.EntityFrameworkCore;

namespace AirHealthV5.Server.Infrastructure.Repositories;

public class AuthRepository : IAuthRepository
{
    private readonly ApplicationDbContext _context;
    private readonly JwtTokenService _jwtTokenService;
    private readonly IConfiguration _configuration;

    public AuthRepository(
        ApplicationDbContext context, 
        JwtTokenService jwtTokenService, 
        IConfiguration configuration)
    {
        _context = context;
        _jwtTokenService = jwtTokenService;
        _configuration = configuration;
    }

    public async Task<LoginResponse?> Login(LoginCommand command, CancellationToken cancellationToken)
    {
        var user = await _context.Users
            .Include(u => u.Devices)
            .FirstOrDefaultAsync(x => x.Username == command.UserName, cancellationToken);

        if (user == null || !PasswordHelper.VerifyPassword(command.Password, user.PasswordHash))
            return null;

        var token =  _jwtTokenService.GenerateJwtToken(user);
        var firstDeviceId = user.Devices?.FirstOrDefault()?.DeviceId;
        
        return new LoginResponse(token, firstDeviceId);
    }

    public async Task Register(RegisterCommand user, CancellationToken cancellationToken)
    {
        var existingUser = await _context.Users
            .FirstOrDefaultAsync(x => x.Username == user.Username, cancellationToken);

        if (existingUser != null)
        {
            throw new InvalidOperationException("Username is already taken.");
        }

        var newUser = new UserModel
        {
            UserId = Guid.NewGuid(),
            Username = user.Username,
            PasswordHash = PasswordHelper.HashPassword(user.Password),
            Created = DateTime.UtcNow,
            IsAdmin = false
        };
        
        _context.Users.Add(newUser);
        await _context.SaveChangesAsync(cancellationToken);
    }
}
