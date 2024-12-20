namespace AirHealthV5.Server.Domain.Models.DTO;

public class PaginatedData
{
    public List<DeviceReadingModel> Data { get; set; }
    public int TotalPages { get; set; }

    public PaginatedData(List<DeviceReadingModel> data, int totalPages)
    {
        Data = data;
        TotalPages = totalPages;
    }
}