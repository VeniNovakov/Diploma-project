using Microsoft.EntityFrameworkCore;
using pizzeria_backend.Models;
using pizzeria_backend.Services.Interfaces;

namespace pizzeria_backend.Services
{
    public class ProductCategoriesService : IProductCategoriesService
    {
        private readonly AppDbContext _context;

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
