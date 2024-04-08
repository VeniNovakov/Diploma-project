using pizzeria_backend.Models;

namespace pizzeria_backend.Services.Interfaces
{
    public interface IAddOnCategoriesService
    {
        public Task<List<AddOnsCategory>> GetAll();
    }
}
