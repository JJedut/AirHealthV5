using AirHealthV5.Server.Application.Queries.SensorDataQueries;
using AirHealthV5.Server.Domain.Models;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace AirHealthV5.Server.Controllers;

[Route("api/[controller]")]
[ApiController]
public class SensorDataController : ControllerBase
{
    private readonly IMediator _mediator;

    public SensorDataController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpPost("Receive")]
    public async Task<IActionResult> ReceiveSensorData([FromBody] SensorDataCommand command)
    {
        var response = await _mediator.Send(command);
        return Ok(response);
    }
    
    [HttpGet("GetSensorData")]
    public async Task<ActionResult<IEnumerable<DeviceReadingModel>>> GetSensorData([FromQuery] SensorDataQuery query)
    {
        var response = await _mediator.Send(query);
        return Ok(response);
    }
    
    [HttpGet("GetLatestSensorReading")]
    public async Task<ActionResult<DeviceReadingModel>> GetLatestSensorReading([FromQuery] GetLatestReadingQuery query)
    {
        var response = await _mediator.Send(query);
        return Ok(response);
    }
}