using AirHealthV5.Server.Infrastructure.Services;
using AirHealthV5.Server.Interfaces.Repository;
using MediatR;

namespace AirHealthV5.Server.Application.Commands.UserCommands;

public class DeleteApiKeyCommand : IRequest<bool>
{
    public Guid KeyId { get; set; }
}

public class DeleteApiKeyCommandHandler : IRequestHandler<DeleteApiKeyCommand, bool>
{
    private readonly ApiKeyService _apiKeyService;

    public DeleteApiKeyCommandHandler(ApiKeyService apiKeyService)
    {
        _apiKeyService = apiKeyService;
    }

    public async Task<bool> Handle(DeleteApiKeyCommand request, CancellationToken cancellationToken)
    {
        return await _apiKeyService.DeleteApiKey(request.KeyId, cancellationToken);
    }
}