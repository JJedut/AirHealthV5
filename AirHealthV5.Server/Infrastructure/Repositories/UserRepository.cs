using AirHealthV5.Server.Application.Commands.UserCommands;
using AirHealthV5.Server.Application.Queries.UserQueries;
using AirHealthV5.Server.DbContext;
using AirHealthV5.Server.Domain.Models;
using AirHealthV5.Server.Interfaces.Repository;
using Microsoft.EntityFrameworkCore;

namespace AirHealthV5.Server.Infrastructure.Repositories;

public class UserRepository : IUserRepository
{
    private readonly ApplicationDbContext _context;

    public UserRepository(ApplicationDbContext context)
    {
        _context = context;
    }


    public async Task<UserModel?> GetUserById(string userId, CancellationToken cancellationToken)
    {
        return await _context.Users
            .FirstOrDefaultAsync(x => x.UserId.ToString() == userId, cancellationToken);
    }

    public async Task<UserModel?> UpdateUser(UpdateUserCommand command, CancellationToken cancellationToken)
    {
        var userToUpdate = await _context.Users
            .FirstOrDefaultAsync(x => x.UserId == command.UserId, cancellationToken);

        if (userToUpdate == null)
        {
            throw new KeyNotFoundException($"User with Id {command.UserId} not found");
        }

        userToUpdate.Username = command.Username;
        //userToUpdate.PasswordHash = command.PasswordHash;

        await _context.SaveChangesAsync(cancellationToken);

        return userToUpdate;
    }

    public async Task<bool> DeleteUser(DeleteUserCommand command, CancellationToken cancellationToken)
    {
        var user = await _context.Users
            .FirstOrDefaultAsync(x => x.UserId == command.UserId, cancellationToken);

        if (user == null)
            return false;

        _context.Users.Remove(user);
        await _context.SaveChangesAsync(cancellationToken);
        
        return true;
    }
}