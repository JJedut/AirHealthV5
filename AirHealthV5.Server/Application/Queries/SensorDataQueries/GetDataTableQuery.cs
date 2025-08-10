using AirHealthV5.Server.Domain.Models;
using AirHealthV5.Server.Domain.Models.DTO;
using AirHealthV5.Server.Helpers;
using AirHealthV5.Server.Interfaces.Repository;
using MediatR;

namespace AirHealthV5.Server.Application.Queries.SensorDataQueries;

public class GetDataTableQuery : IRequest<PaginatedData>
{
    public DateTime? From { get; set; }
    public DateTime? To { get; set; }
    public Guid DeviceId { get; set; }
    public int? PageSize { get; set; } = 100;
    public int? PageNumber { get; set; } = 1;
}
public class GetDataTableQueryHandler : IRequestHandler<GetDataTableQuery, PaginatedData>
{
    private readonly IDeviceReadingRepository _deviceReadingRepository;

    public GetDataTableQueryHandler(IDeviceReadingRepository deviceReadingRepository)
    {
        _deviceReadingRepository = deviceReadingRepository;
    }

    public async Task<PaginatedData> Handle(GetDataTableQuery query, CancellationToken cancellationToken)
    {
        if (query.From == null || query.To == null || query.From > query.To)
        {
            throw new ArgumentException("Invalid time window request");
        }
        if (query.PageNumber < 1)
        {
            throw new ArgumentException("Page number must be greater than or equal to 1.");
        }
        
        int pageSize = query.PageSize ?? 500;
        
        int totalCount = await _deviceReadingRepository.GetSensorTableDataCount(query, cancellationToken);
        
        int totalPages = (int)Math.Ceiling(totalCount / (double)pageSize);

        var data = await _deviceReadingRepository.GetSensorTableData(query, cancellationToken);

        var dataDTo = data.Select(e => e.ToDto()).ToList();
        
        return new PaginatedData(dataDTo, totalPages);
    }
}