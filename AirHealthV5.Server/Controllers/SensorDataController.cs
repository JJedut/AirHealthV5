using AirHealthV5.Server.Command.SensorDataCommand;
using AirHealthV5.Server.DbContext;
using AirHealthV5.Server.Models;
using AirHealthV5.Server.Query.SensorDataQuery;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace AirHealthV5.Server.Controllers;

[Route("api/[controller]")]
[ApiController]
public class SensorDataController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly IMediator _mediator;

    public SensorDataController(ApplicationDbContext context, IMediator mediator)
    {
        _context = context;
        _mediator = mediator;
    }

    [HttpPost("Receive")]
    public async Task<IActionResult> ReceiveSensorData([FromBody] SensorDataCommand command)
    {
        var response = await _mediator.Send(command);
        return Ok(response);
    }
    
    [HttpGet("GetSensorData")]
    public async Task<ActionResult<IEnumerable<SensorReadingModel>>> GetSensorData([FromQuery] SensorDataQuery query)
    {
        var response = await _mediator.Send(query);
        return Ok(response);
    }
}