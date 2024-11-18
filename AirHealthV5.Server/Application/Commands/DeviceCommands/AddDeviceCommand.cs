using AirHealthV5.Server.Domain.Models;
using AirHealthV5.Server.Infrastructure.Services;
using AirHealthV5.Server.Interfaces.Repository;
using MediatR;

namespace AirHealthV5.Server.Application.Commands.DeviceCommands;

public class AddDeviceCommand : IRequest<bool>
{
    public string DeviceName { get; set; } = string.Empty;
    public string ApiKey { get; set; } = string.Empty;
    public Guid UserId { get; set; }
}

public class AddDeviceCommandHandler : IRequestHandler<AddDeviceCommand, bool>
{
    private readonly IDeviceRepository _context;
    private readonly ApiKeyService _apiKeyService;

    public AddDeviceCommandHandler(IDeviceRepository context, ApiKeyService apiKeyService)
    {
        _context = context;
        _apiKeyService = apiKeyService;
    }

    public async Task<bool> Handle(AddDeviceCommand request, CancellationToken cancellationToken)
    {
        var existingApiKey = await _apiKeyService.ValidateApiKey(request.ApiKey);
        
        if (!existingApiKey)
        {
            return false;
        }
        
        var device = new DeviceModel
        {
            DeviceId = Guid.NewGuid().ToString(),
            DeviceName = request.DeviceName,
            ApiKey = request.ApiKey,
            UserId = request.UserId,
            IsActive = true,
            Created = DateTime.UtcNow,
            LastUpdate = DateTime.UtcNow
        };
        
        return await _context.AddDevice(device, cancellationToken);
    }
}