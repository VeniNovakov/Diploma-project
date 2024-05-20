using pizzeria_backend.Models;

namespace pizzeria_backend.Services.Interfaces
{
    public interface IProductCategoriesService
    {
        public Task<List<ProductsCategory>> GetAll();
    }
}
