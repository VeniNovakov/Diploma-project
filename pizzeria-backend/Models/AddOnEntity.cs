using pizzeria_backend.Models.Interfaces;

namespace pizzeria_backend.Models
{
    public class AddOn : IAddOn
    {

        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public int CategoryId { get; set; }
        public AddOnsCategory Category { get; set; }
        public decimal Price { get; set; }
        public int AmountInGrams { get; set; }
    }
}
