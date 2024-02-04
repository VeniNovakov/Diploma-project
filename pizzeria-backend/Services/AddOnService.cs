using Microsoft.EntityFrameworkCore;
using pizzeria_backend.Models;

namespace pizzeria_backend.Services
{

    public interface IAddOnService
    {
        public Task<AddOn> AddAddOn(AddOn addOn);
        public Task<AddOn> GetAddOn(int Id);
        public Task<AddOn> UpdateAddOn(AddOn addOn);
        public Task<AddOn> DeleteAddOn(int Id);
    }
    public class AddOnService : IAddOnService
    {
        private readonly AppDbContext _context;

        public AddOnService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<AddOn> AddAddOn(AddOn addOn)
        {
            await _context.AddOns.AddAsync(addOn);
            await _context.SaveChangesAsync();

            return addOn;

        }

        public async Task<AddOn> GetAddOn(int Id)
        {
            AddOn addOn = _context.AddOns
                .Include(a => a.Category)
                .FirstOrDefault(a => a.Id == Id);

            return addOn;
        }
        public async Task<AddOn> UpdateAddOn(AddOn addOn)
        {
            _context.AddOns.Update(addOn);

            await _context.SaveChangesAsync();

            return addOn;

        }

        public async Task<AddOn> DeleteAddOn(int Id)
        {
            var addOn = await _context.AddOns.FindAsync(Id);
            if (addOn != null)
            {
                _context.AddOns.Remove(addOn);
                await _context.SaveChangesAsync();
            }

            return addOn;

        }
    }
}
