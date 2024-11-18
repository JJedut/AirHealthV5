using AirHealthV5.Server.Domain.Models.IDK;
using AirHealthV5.Server.Interfaces.Repository;
using MediatR;

namespace AirHealthV5.Server.Application.Commands.AuthCommands;

public class LoginCommand : IRequest<LoginResponse?>
{
    public string UserName { get; set; }
    public string Password { get; set; }
}

public class LoginCommandHandler : IRequestHandler<LoginCommand, LoginResponse?>
{
    private readonly IAuthRepository _context;

    public LoginCommandHandler(IAuthRepository context)
    {
        _context = context;
    }

    public async Task<LoginResponse?> Handle(LoginCommand request, CancellationToken cancellationToken)
    {
        return await _context.Login(request, cancellationToken);
    }
}