using AirHealthV5.Server.Application.Queries.SensorDataQueries;
using AirHealthV5.Server.Domain.Models;
using AirHealthV5.Server.Domain.Models.DTO;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace AirHealthV5.Server.Controllers;

[Route("api/[controller]")]
[ApiController]
public class SensorDataController : ControllerBase
{
    private readonly IMediator _mediator;
    private readonly ILogger<SensorDataController> _logger;

    public SensorDataController(IMediator mediator, ILogger<SensorDataController> logger)
    {
        _mediator = mediator;
        _logger = logger;
    }

    [HttpPost]
    public async Task<IActionResult> ReceiveSensorData([FromBody] SensorDataCommand command)
    {
        if (command == null)
        {
            return BadRequest("Command body is required.");
        }

        try
        {
            var response = await _mediator.Send(command);
            return Ok(response);
        }
        catch (UnauthorizedAccessException ex)
        {
            return Unauthorized(ex.Message);
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"An error occurred: {ex.Message}");
        }
    }
    
    [HttpGet("GetSensorDataChart")]
    public async Task<ActionResult<ChartDataFormatModel>> GetSensorDataChart([FromQuery] SensorDataChartQuery chartQuery)
    {
        var response = await _mediator.Send(chartQuery);
        return Ok(response);
    }
    
    [HttpGet("GetSensorDataTable")]
    public async Task<ActionResult> GetSensorDataTable([FromQuery] GetDataTableQuery query)
    {
        var response = await _mediator.Send(query);
        return Ok(response);
    }
    
    [HttpGet("GetLatestSensorReading")]
    public async Task<ActionResult<DeviceReadingDto>> GetLatestSensorReading([FromQuery] GetLatestReadingQuery query)
    {
        var response = await _mediator.Send(query);
        return Ok(response);
    }
}