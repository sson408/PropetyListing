using System.Text.Json.Serialization;

namespace PropertyListing.Models
{
    public class ApiResponse<T>
    {
        [JsonPropertyName("pagination")]
        public Pagination Pagination { get; set; }

        [JsonPropertyName("results")]
        public List<T> DataList { get; set; }
    }

    public class Pagination
    {
        [JsonPropertyName("pageNumber")]
        public int PageNumber { get; set; }

        [JsonPropertyName("pageSize")]
        public int PageSize { get; set; }
    }
}
