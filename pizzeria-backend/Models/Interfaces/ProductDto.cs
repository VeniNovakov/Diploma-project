namespace pizzeria_backend.Models.Interfaces
{
    public class ProductDto : IProductDto
    {
        public IFormFile? Image { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public decimal Price { get; set; }
        public int CategoryId { get; set; }
        public bool IsInMenu { get; set; }
        public bool IsAvailable { get; set; }
    }
}
