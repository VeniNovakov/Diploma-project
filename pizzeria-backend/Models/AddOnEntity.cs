namespace pizzeria_backend.Models
{
    public class AddOnEntity
    {

        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string Type { get; set; }

        public decimal Price { get; set; }

        public int AmountInGrams { get; set; }
    }
}
