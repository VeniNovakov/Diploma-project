using Microsoft.EntityFrameworkCore;
using pizzeria_backend.Models;

namespace pizzeria_backend.Services
{
    public interface IAddOnCategoriesService
    {
        public Task<List<AddOnsCategory>> GetAll();
    }
    public class AddOnCategoriesService : IAddOnCategoriesService
    {
        AppDbContext _context;
        public AddOnCategoriesService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<AddOnsCategory>> GetAll()
        {

            var ctgs = await _context.AddOnsCategory.ToListAsync();

            return ctgs;
        }
    }
}
