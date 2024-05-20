using pizzeria_backend.Models;

namespace pizzeria_backend.Services.Interfaces
{
    public interface IAddOnService
    {
        public Task<AddOn> AddAddOn(AddOn addOn);
        public Task<AddOn> GetAddOn(int Id);
        public Task<List<AddOn>> GetAllAddOns();
        public Task<AddOn> UpdateAddOn(AddOn addOn);
        public Task<AddOn> DeleteAddOn(int Id);
    }
}
