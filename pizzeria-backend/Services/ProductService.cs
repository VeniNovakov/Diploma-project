using pizzeria_backend.Models;
namespace pizzeria_backend.Services
{
    public interface IProductService
    {
        public Task<Product> AddProductAsync(Product product);
        public Task<Product> GetProduct(int id);
        public Task<Product> DeleteProduct(int id);
    }

    public class ProductService : IProductService
    {
        private readonly AppDbContext _context;

        public ProductService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<Product> AddProductAsync(Product product)
        {
            _context.Products.Add(product);
            await _context.SaveChangesAsync();

            return await _context.Products.FindAsync(product.Id);

        }

        public async Task<Product> GetProduct(int id)
        {
            var product = await _context.Products.FindAsync(id);

            return product;

        }
        public async Task<Product> DeleteProduct(int id)
        {
            var product = await _context.Products.FindAsync(id);
            if (product != null)
            {
                _context.Products.Remove(product);
                await _context.SaveChangesAsync();
            }

            return product;

        }
    }
}
