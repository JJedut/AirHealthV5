using AirHealthV5.Server.Application.Commands.UserCommands;
using AirHealthV5.Server.Application.Queries.UserQueries;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace AirHealthV5.Server.Controllers;

[Route("api/[controller]")]
[ApiController]
public class UserController : ControllerBase
{
    private readonly IMediator _mediator;

    public UserController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpPut("UpdateUser")]
    public async Task<IActionResult> UpdateUser([FromBody] UpdateUserCommand command)
    {
        var updateUser = await _mediator.Send(command);
        return Ok(updateUser);
    }

    [HttpDelete("DeleteUser")]
    public async Task<IActionResult> DeleteUser([FromBody] DeleteUserCommand command)
    {
        Console.WriteLine("Deleting user");
        var result = await _mediator.Send(command);
        return result ? NoContent() : NotFound();
    }

    [HttpPost("GenerateApiKey")]
    public async Task<IActionResult> GenerateNewApiKey([FromBody] GenerateApiKeyCommand command)
    {
        var newApiKey = await _mediator.Send(command);
        
        return Ok(new { ApiKey = newApiKey });
    }

    [HttpGet("ApiKeys")]
    public async Task<IActionResult> GetUserApiKeys([FromQuery] Guid userId)
    {
        var query = new GetApiKeysQuery { UserId = userId };
        var apiKeys = await _mediator.Send(query);
        
        return Ok(apiKeys);
    }
    
    [HttpDelete("DeleteDeviceApiKey")]
    public async Task<IActionResult> DeleteDeviceApiKey([FromBody] DeleteApiKeyCommand command)
    {
        var result = await _mediator.Send(command);
        return result ? Ok() : NotFound();
    }
}