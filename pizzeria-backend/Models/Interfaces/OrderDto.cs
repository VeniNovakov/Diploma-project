namespace pizzeria_backend.Models.Interfaces
{
    public class OrderDto
    {
        public DateTime WantedFor { get; set; }
        public IEnumerable<OrderedProductsDto> Items { get; set; } = new List<OrderedProductsDto>();
    }
}
