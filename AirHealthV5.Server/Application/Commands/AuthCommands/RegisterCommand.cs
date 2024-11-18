using AirHealthV5.Server.Domain.Models;
using AirHealthV5.Server.Interfaces.Repository;
using MediatR;

namespace AirHealthV5.Server.Application.Commands.AuthCommands;

public class RegisterCommand : IRequest
{
    public string Username { get; set; }
    public string Password { get; set; }
}

public class RegisterCommandHandler : IRequestHandler<RegisterCommand>
{
    private readonly IAuthRepository _context;

    public RegisterCommandHandler(IAuthRepository context)
    {
        _context = context;
    }

    public async Task Handle(RegisterCommand request, CancellationToken cancellationToken)
    {
        await _context.Register(request, cancellationToken);
    }
}