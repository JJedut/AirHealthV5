using AirHealthV5.Server.Infrastructure.Services;
using AirHealthV5.Server.Interfaces;
using MediatR;

namespace AirHealthV5.Server.Application.Commands.UserCommands;

public class GenerateApiKeyCommand : IRequest<string>
{
    public Guid UserId { get; set; }
    public string KeyName { get; set; }
}

public class GenerateApiKeyCommandHandler : IRequestHandler<GenerateApiKeyCommand, string>
{
    private readonly ApiKeyService _apiKeyService;
    
    public GenerateApiKeyCommandHandler(ApiKeyService apiKeyService)
    {
        _apiKeyService = apiKeyService;
    }

    public async Task<string> Handle(GenerateApiKeyCommand request, CancellationToken cancellationToken)
    {
        return await _apiKeyService.GenerateApiKey(request, cancellationToken);
    }
}