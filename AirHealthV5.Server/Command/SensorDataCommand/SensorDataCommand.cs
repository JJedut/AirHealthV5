using AirHealthV5.Server.DbContext;
using AirHealthV5.Server.Models;
using MediatR;

namespace AirHealthV5.Server.Command.SensorDataCommand;

public class SensorDataCommand : IRequest<string>
{
    public string Value { get; set; }
}