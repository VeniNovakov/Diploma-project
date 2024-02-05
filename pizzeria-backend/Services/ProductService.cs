using Microsoft.EntityFrameworkCore;
using pizzeria_backend.Models;
namespace pizzeria_backend.Services
{
    public interface IProductService
    {
        public Task<Product> AddProductAsync(Product product);
        public Task<Product> GetProduct(int id);
        public Task<Product> UpdateProduct(Product product);
        public Task<Product> DeleteProduct(int id);
        public Task<List<Product>> GetMenu();
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
            await _context.Products.AddAsync(product);
            await _context.SaveChangesAsync();

            return product;

        }

        public async Task<Product> GetProduct(int Id)
        {
            var product = await _context.Products.Include(product => product.Category).Where(product => product.Id == Id).FirstAsync();

            return product;

        }
        public async Task<List<Product>> GetMenu()
        {
            var products = _context.Products.Include(product => product.Category).Where(product => product.IsInMenu).ToList();

            return products;

        }

        public async Task<Product> UpdateProduct(Product product)
        {
            _context.Products.Update(product);

            await _context.SaveChangesAsync();

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
