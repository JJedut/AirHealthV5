using AirHealthV5.Server.Application.Commands.UserCommands;
using AirHealthV5.Server.DbContext;
using AirHealthV5.Server.Domain.Models;
using Microsoft.EntityFrameworkCore;

namespace AirHealthV5.Server.Infrastructure.Services;

public class ApiKeyService
{
    private readonly ApplicationDbContext _context;

    public ApiKeyService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<string> GenerateApiKey(GenerateApiKeyCommand command, CancellationToken cancellationToken)
    {
        var apiKey = new ApiKeyModel
        {
            KeyId = Guid.NewGuid(),
            KeyName = command.KeyName,
            Key = Guid.NewGuid().ToString("N"),
            UserId = command.UserId,
            CreatedOn = DateTime.UtcNow,
            IsActive = true,
        };
        
        _context.ApiKeys.Add(apiKey);
        await _context.SaveChangesAsync(cancellationToken);
        
        return apiKey.Key;
    }

    public async Task<bool> ValidateApiKey(string apiKey)
    {
        var key = await _context.ApiKeys
            .FirstOrDefaultAsync(x => x.Key == apiKey && x.IsActive);
        
        return key != null;
    }

    public async Task<List<ApiKeyModel>> GetApiKeysByUserId(Guid userId, CancellationToken cancellationToken)
    {
        return await _context.ApiKeys
            .Where(x => x.UserId == userId)
            .ToListAsync(cancellationToken);
    }
    
    public async Task<bool> DeleteApiKey(Guid keyId, CancellationToken cancellationToken)
    {
        var key = await _context.ApiKeys
            .FirstOrDefaultAsync(x => x.KeyId == keyId, cancellationToken);
    
        if (key == null)
        {
            return false;
        }

        _context.ApiKeys.Remove(key);
        await _context.SaveChangesAsync(cancellationToken);

        return true;
    }

}