using pizzeria_backend.Models;

namespace pizzeria_backend.Services.Interfaces
{
    public interface IProductService
    {
        public Task<Product> AddProductAsync(Product product);
        public Task<Product> GetProduct(int id);
        public Task<List<Product>> GetAllProducts();
        public Task<Product> UpdateProduct(Product product);
        public Task<Product> DeleteProduct(int id);
        public Task<List<Product>> GetMenu();
    }
}
