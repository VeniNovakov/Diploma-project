using pizzeria_backend.Models;
using pizzeria_backend.Models.Interfaces;

namespace pizzeria_backend.Services.Interfaces
{
    public interface IBasketService
    {
        public Task<Basket> GetBasket(int userId);
        public Task<BasketProduct> AddProduct(AddProductToBasketDto product, int userId);
        public Task<BasketProduct> EditAmount(int productId, bool addToProduct);
        public Task RemoveProduct(int productId);
    }
}
