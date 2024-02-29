using Microsoft.EntityFrameworkCore;
using pizzeria_backend.Models;

namespace pizzeria_backend.Services
{
    public interface IProductCategoriesService
    {
        public Task<List<ProductsCategory>> GetAll();
    }
    public class ProductCategoriesService : IProductCategoriesService
    {
        AppDbContext _context;
        public ProductCategoriesService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<ProductsCategory>> GetAll()
        {
            var ctgs = await _context.ProductsCategories.ToListAsync();

            return ctgs;
        }
    }
}
