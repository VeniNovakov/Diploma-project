using System.Text.Json.Serialization;

namespace pizzeria_backend.Models.Interfaces
{
    public class OrderDto
    {
        public DateTime WantedFor { get; set; }
        [JsonPropertyName("Items")]
        public List<OrderedProductsDto> Items { get; set; } = new List<OrderedProductsDto>();
    }
}
