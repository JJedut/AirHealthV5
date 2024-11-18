using AirHealthV5.Server.Application.Commands.AuthCommands;
using AirHealthV5.Server.Domain.Models.IDK;

namespace AirHealthV5.Server.Interfaces.Repository;

public interface IAuthRepository
{
    Task<LoginResponse?> Login(LoginCommand command, CancellationToken cancellationToken);
    Task Register(RegisterCommand user, CancellationToken cancellationToken);
}