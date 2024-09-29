using AirHealthV5.Server.Interfaces.Repository;
using AirHealthV5.Server.Models;
using MediatR;

namespace AirHealthV5.Server.Query.SensorDataQuery;

public class SensorDataQuery : IRequest<List<SensorReadingModel>>
{
    public DateTime? From { get; set; }
    public DateTime? To { get; set; }
}