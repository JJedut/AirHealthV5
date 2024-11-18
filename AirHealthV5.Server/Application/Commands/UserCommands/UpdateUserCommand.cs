using System.Security.Claims;
using AirHealthV5.Server.Domain.Models;
using AirHealthV5.Server.Interfaces.Repository;
using MediatR;

namespace AirHealthV5.Server.Application.Commands.UserCommands;

public class UpdateUserCommand : IRequest<UserModel?>
{
    public Guid? UserId { get; set; }
    public string? Username { get; set; }
}

public class UpdateUserCommandHandler : IRequestHandler<UpdateUserCommand, UserModel?>
{
    private readonly IUserRepository _userRepository;

    public UpdateUserCommandHandler(IUserRepository userRepository)
    {
        _userRepository = userRepository;
    }

    public async Task<UserModel?> Handle(UpdateUserCommand request, CancellationToken cancellationToken)
    {
        return await _userRepository.UpdateUser(request, cancellationToken);
    }
}