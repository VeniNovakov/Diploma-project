namespace pizzeria_backend.Models.Interfaces
{
    public class AddProductToBasketDto
    {
        public int Id { get; set; }
        public int Amount { get; set; }
        public IEnumerable<AddAddOnToBasketDto>? AddOns { get; set; }
    }
}
