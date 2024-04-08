using pizzeria_backend.Models;
using pizzeria_backend.Models.Interfaces;

namespace pizzeria_backend.Services.Interfaces
{
    public interface IOrderService
    {
        public Task<Order> MakeOrder(OrderDto Order);
        public Task<Order> GetOrder(int Id);
        public Task<Order> DeleteOrder(int Id);
        public Task<Order> ChangeOrderCompletion(int Id);
        public Task<InvalidOrdersDto> ValidateOrder(OrderDto Order);
        public Task<List<Order>> GetOrders();
    }
}
