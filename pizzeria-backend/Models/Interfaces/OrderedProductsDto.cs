namespace pizzeria_backend.Models.Interfaces
{
    public class OrderedProductsDto
    {
        public int ProductId { get; set; }
        public IEnumerable<OrderedAddOnsDto>? AddOns { get; set; } = new List<OrderedAddOnsDto>();
        public int Amount { get; set; }
    }
}
