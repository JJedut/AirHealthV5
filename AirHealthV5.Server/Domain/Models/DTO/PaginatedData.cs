namespace AirHealthV5.Server.Domain.Models.DTO;

public class PaginatedData
{
    public List<DeviceReadingDto> Data { get; set; }
    public int TotalPages { get; set; }

    public PaginatedData(List<DeviceReadingDto> data, int totalPages)
    {
        Data = data;
        TotalPages = totalPages;
    }
}