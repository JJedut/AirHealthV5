using AirHealthV5.Server.Domain.Models;
using AirHealthV5.Server.Infrastructure.Services;
using MediatR;

namespace AirHealthV5.Server.Application.Queries.UserQueries;

public class GetApiKeysQuery : IRequest<List<ApiKeyModel>>
{
    public Guid UserId { get; set; }
}

public class GetApiKeysQueryHandler : IRequestHandler<GetApiKeysQuery, List<ApiKeyModel>>
{
    private readonly ApiKeyService _apiKeyService;

    public GetApiKeysQueryHandler(ApiKeyService apiKeyService)
    {
        _apiKeyService = apiKeyService;
    }

    public async Task<List<ApiKeyModel>> Handle(GetApiKeysQuery request, CancellationToken cancellationToken)
    {
        return await _apiKeyService.GetApiKeysByUserId(request.UserId, cancellationToken);
    }
}