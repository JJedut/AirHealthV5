
using AirHealthV5.Server.Application.Commands.UserCommands;
using AirHealthV5.Server.Application.Queries.UserQueries;
using AirHealthV5.Server.Domain.Models;

namespace AirHealthV5.Server.Interfaces.Repository;

public interface IUserRepository
{
    public Task<UserModel?> GetUserById(string userId, 
        CancellationToken cancellationToken);
    public Task<UserModel?> UpdateUser(UpdateUserCommand command,
        CancellationToken cancellationToken);
    public Task<bool> DeleteUser(DeleteUserCommand command, 
        CancellationToken cancellationToken);
}