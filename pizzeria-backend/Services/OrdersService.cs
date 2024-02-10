using Microsoft.EntityFrameworkCore;
using pizzeria_backend.Models;
using pizzeria_backend.Models.Interfaces;

namespace pizzeria_backend.Services
{
    public interface IOrderService
    {
        public Task<Order> MakeOrder(OrderDto Order);
        public Task<Order> GetOrder(int Id);
        public Task<Order> ChangeOrderCompletion(int Id);
        public Task<List<Order>> GetOrders(bool IsCompleted);

    }
    public class OrdersService : IOrderService
    {
        private readonly AppDbContext _context;

        public OrdersService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<Order> MakeOrder(OrderDto order)
        {
            var dbOrder = new Order { WantedFor = order.WantedFor };
            _context.Order.Add(dbOrder);

            foreach (var item in order.Items)
            {
                var dbOrderedProduct = new OrderedProduct
                {
                    ProductId = item.ProductId,
                    Amount = item.Amount,
                    Order = dbOrder
                };
                _context.OrderedProducts.Add(dbOrderedProduct);

                foreach (var addOn in item.AddOns)
                {
                    var dbOrderedAddOn = new OrderedAddOn
                    {
                        Amount = addOn.Amount,
                        AddOnId = addOn.AddOnId,
                        Product = dbOrderedProduct,
                    };
                    _context.OrderedAddOns.Add(dbOrderedAddOn);
                }
            }

            await _context.SaveChangesAsync();
            return dbOrder;
        }

        public Microsoft.EntityFrameworkCore.Query.IIncludableQueryable<Order, ProductsCategory> GetOrderRelations()
        {
            return _context.Order
                .Include(order => order.OrderedProducts)
                .ThenInclude(op => op.AddOns)
                .ThenInclude(oa => oa.AddOn)
                .ThenInclude(oa => oa.Category)
                .Include(order => order.OrderedProducts)
                .ThenInclude(op => op.Product)
                .ThenInclude(pr => pr.Category);
        }
        public async Task<Order> GetOrder(int Id)
        {
            var order = await GetOrderRelations()
                .Where(ord => ord.Id == Id).FirstAsync();
            return order;
        }

        public async Task<Order> ChangeOrderCompletion(int Id)
        {
            var order = await _context.Order.FindAsync(Id);
            if (order == null)
            {
                return order;
            }
            order.IsCompleted = !order.IsCompleted;

            await _context.SaveChangesAsync();

            return order;
        }

        public async Task<List<Order>> GetOrders(bool IsCompleted)
        {
            var order = await GetOrderRelations()
                .Where(ord => ord.IsCompleted == IsCompleted).ToListAsync();
            return order;
        }

        private OrderedAddOn ConvertToOrderedAddOns(OrderedAddOnsDto AddOn, int productId)
        {
            return new OrderedAddOn
            {
                ProductId = productId,
                AddOnId = AddOn.AddOnId,
                Amount = AddOn.Amount,
            };
        }
        private OrderedProduct ConvertToOrderedProduct(OrderedProductsDto product, int orderId)
        {
            return new OrderedProduct
            {
                OrderId = orderId,
                ProductId = product.ProductId,
                Amount = product.Amount,
            };
        }
        private Order ConvertToOrder(OrderDto order)
        {
            return new Order
            {
                WantedFor = order.WantedFor,
            };
        }
    }
}
