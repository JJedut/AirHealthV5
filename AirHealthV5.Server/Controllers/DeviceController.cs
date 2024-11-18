using AirHealthV5.Server.Application.Commands.DeviceCommands;
using AirHealthV5.Server.Application.Queries.DeviceQueries;
using AirHealthV5.Server.DbContext;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace AirHealthV5.Server.Controllers;

[Route("api/[controller]")]
[ApiController]
public class DeviceController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly IMediator _mediator;

    public DeviceController(ApplicationDbContext context, IMediator mediator)
    {
        _context = context;
        _mediator = mediator;
    }

    [HttpPost("Add")]
    public async Task<IActionResult> AddDevice([FromBody] AddDeviceCommand command)
    {
        var isAdded = await _mediator.Send(command);
        return Ok(isAdded);
    }

    [HttpGet("GetDevicesByUserId")]
    public async Task<IActionResult> GetDevicesByUserId([FromQuery] GetDevicesByUserIdQuery request)
    {
        var devices = await _mediator.Send(request);
        return Ok(devices);
    }

    [HttpGet("GetDeviceById")]
    public async Task<IActionResult> GetDeviceById([FromQuery] GetDeviceByIdQuery request)
    {
        var device = await _mediator.Send(request);
        return Ok(device);
    }

    [HttpDelete("DeleteDevice")]
    public async Task<IActionResult> DeleteDevice([FromQuery] DeleteDeviceCommand command)
    {
        var result = await _mediator.Send(command);
        if (!result) return NotFound();
        return Ok(result);
    }
    
    [HttpGet("GetSensorOrderByUserId/{userId}")]
    public async Task<IActionResult> GetSensorOrderByUserId([FromRoute] string userId)
    {
        if (string.IsNullOrWhiteSpace(userId))
        {
            return BadRequest("UserId cannot be null or empty.");
        }

        var query = new GetSensorOrderQuery { DeviceId = userId };
        var result = await _mediator.Send(query);

        return Ok(result);
    }

    [HttpPost("SaveSensorOrder")]
    public async Task<IActionResult> SaveSensorOrder([FromBody] SaveSensorOrderCommand command)
    {
        var result = await _mediator.Send(command);
        return result ? Ok() : NotFound();
    }
}