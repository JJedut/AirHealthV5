using AirHealthV5.Server.Infrastructure.Services;
using Microsoft.Extensions.Primitives;

namespace AirHealthV5.Server.Middleware;

public class ApiKeyMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ApiKeyService _apiKeyService;

    public ApiKeyMiddleware(RequestDelegate next, ApiKeyService apiKeyService)
    {
        _next = next;
        _apiKeyService = apiKeyService;
    }

    public async Task Invoke(HttpContext context)
    {
        if (context.Request.Path.StartsWithSegments("/api/SensorData/Receive"))
        {
            if (!context.Request.Headers.TryGetValue("X-Api-Key", out StringValues apiKeyValues) 
                || StringValues.IsNullOrEmpty(apiKeyValues) 
                || !await _apiKeyService.ValidateApiKey(apiKeyValues.ToString()))
            {
                context.Response.StatusCode = 401;
                await context.Response.WriteAsync("API Key is invalid");
                return;
            }
        }
        
        await _next(context);
    }
}