namespace pizzeria_backend.Models.Interfaces
{
    public interface IAddOn
    {
        string Name { get; set; }
        string Description { get; set; }
        public int AmountInGrams { get; set; }
        public int CategoryId { get; set; }
        public decimal Price { get; set; }
    }
}
