using Microsoft.EntityFrameworkCore;
using pizzeria_backend.Models;
using pizzeria_backend.Services.Interfaces;

namespace pizzeria_backend.Services
{
    public class AddOnCategoriesService : IAddOnCategoriesService
    {
        private readonly AppDbContext _context;

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
