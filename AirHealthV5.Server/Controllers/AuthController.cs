using AirHealthV5.Server.Application.Commands.AuthCommands;
using AirHealthV5.Server.Domain.Models;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace AirHealthV5.Server.Controllers;

[Route("api/[controller]")]
[ApiController]
public class AuthController : ControllerBase
{
    private readonly IMediator _mediator;

    public AuthController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginCommand request)
    {
        var response = await _mediator.Send(request);

        if (response == null)
        {
            return Unauthorized("Invalid username or password");
        }
        
        return Ok(new { Token = response.Token, DeviceId = response.FirstDeviceId });
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterCommand command)
    {
        await _mediator.Send(command);

        return CreatedAtAction(nameof(Register), new { message = "Registration successful!" });
    }


}