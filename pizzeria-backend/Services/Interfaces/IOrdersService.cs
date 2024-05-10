using pizzeria_backend.Models;
using pizzeria_backend.Models.Interfaces;

namespace pizzeria_backend.Services.Interfaces
{
    public interface IOrdersService
    {
        public Task<Order> MakeOrder(OrderDto Order, int userId);
        public Task<Order> GetOrder(int Id);
        public Task<Order> DeleteOrder(int Id);
        public Task<Order> ChangeOrderCompletion(int Id);
        public Task<InvalidOrdersDto> ValidateOrder(OrderDto Order);
        public Task<IEnumerable<Order>> GetOrders();
    }
}
