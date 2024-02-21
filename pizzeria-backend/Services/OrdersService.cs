using Microsoft.EntityFrameworkCore;
using pizzeria_backend.Models;
using pizzeria_backend.Models.Interfaces;

namespace pizzeria_backend.Services
{
    public interface IOrderService
    {
        public Task<Order> MakeOrder(OrderDto Order);
        public Task<Order> GetOrder(int Id);
        public Task<Order> DeleteOrder(int Id);
        public Task<Order> ChangeOrderCompletion(int Id);
        public Task<(List<int> productIds, List<int> addOnIds)> ValidateOrder(OrderDto Order);
        public Task<List<Order>> GetOrders();

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
            var orderValidation = (await ValidateOrder(order));

            if (orderValidation.productIds.Count != 0 && orderValidation.addOnIds.Count != 0)
            {
                return null;
            }

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

        public async Task<Order> DeleteOrder(int id)
        {
            var order = await _context.Order.FindAsync(id);
            if (order != null)
            {
                _context.Order.Remove(order);
                await _context.SaveChangesAsync();
            }

            return order;

        }

        public async Task<List<Order>> GetOrders()
        {
            var order = await GetOrderRelations().ToListAsync();
            return order;
        }

        public async Task<(List<int> productIds, List<int> addOnIds)> ValidateOrder(OrderDto order)
        {


            List<int> productIds = [];
            List<int> addOnIds = [];
            foreach (OrderedProductsDto op in order.Items)
            {
                var opp = await _context.Products.FindAsync(op.ProductId);
                if (opp is null)
                {
                    productIds.Add(op.ProductId);

                }
                else if (opp.IsInMenu == false || opp.IsAvailable == false)
                {
                    productIds.Add(op.ProductId);
                }
                foreach (OrderedAddOnsDto oa in op.AddOns)
                {
                    var oao = await _context.AddOns.FindAsync(oa.AddOnId);
                    if (oao is null)
                    {
                        addOnIds.Add(oa.AddOnId);
                    }
                }

            }
            return (productIds = productIds, addOnIds = addOnIds);
        }
    }

}
