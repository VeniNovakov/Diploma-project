using Microsoft.EntityFrameworkCore;
using pizzeria_backend.Models;
using pizzeria_backend.Models.Interfaces;
using System.ComponentModel.DataAnnotations;

namespace pizzeria_backend.Services
{


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

            if (orderValidation.ProductIds.Count != 0 && orderValidation.AddOnIds.Count != 0)
            {
                throw new ValidationException();
            }

            var dbOrder = new Order
            {
                WantedFor = order.WantedFor,
                OrderedProducts = order
                    .Items.Select(item => new OrderedProduct
                    {
                        ProductId = item.ProductId,
                        Amount = item.Amount,
                        AddOns = item
                            .AddOns?.Select(addon => new OrderedAddOn
                            {
                                AddOnId = addon.AddOnId,
                                Amount = addon.Amount
                            })
                            .ToList()
                    })
                    .ToList()
            };

            _context.Order.Add(dbOrder);

            await _context.SaveChangesAsync();

            return (await GetOrderRelations().Where(ord => ord.Id == dbOrder.Id).FirstAsync());
        }

        public Microsoft.EntityFrameworkCore.Query.IIncludableQueryable<
            Order,
            ProductsCategory
        > GetOrderRelations()
        {
            return _context
                .Order.Include(order => order.OrderedProducts)
                .ThenInclude(op => op.AddOns)
                .ThenInclude(oa => oa.AddOn)
                .ThenInclude(oa => oa.Category)
                .Include(order => order.OrderedProducts)
                .ThenInclude(op => op.Product)
                .ThenInclude(pr => pr.Category);
        }

        public async Task<Order> GetOrder(int Id)
        {
            var order = await GetOrderRelations().Where(ord => ord.Id == Id).FirstAsync();
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
            var orders = await _context
                .Order.Select(order => new Order
                {
                    Id = order.Id,
                    WantedFor = order.WantedFor,
                    OrderedProducts = order
                        .OrderedProducts.Select(op => new OrderedProduct
                        {
                            AddOns = op
                                .AddOns.Select(oa => new OrderedAddOn
                                {
                                    Id = oa.Id,
                                    AddOn = new AddOn
                                    {
                                        Id = oa.AddOn.Id,
                                        Name = oa.AddOn.Name,
                                        AmountInGrams = oa.AddOn.AmountInGrams,
                                        Category = oa.AddOn.Category,
                                        Description = oa.AddOn.Description,
                                        Price = oa.AddOn.Price,
                                    },
                                    Amount = oa.Amount,
                                })
                                .ToList(),

                            Product = new Product
                            {
                                Id = op.ProductId,
                                Name = op.Product.Name,
                                IsAvailable = op.Product.IsAvailable,
                                IsInMenu = op.Product.IsInMenu,
                                Category = op.Product.Category,
                                Description = op.Product.Description,
                                Price = op.Product.Price,
                            },
                            Amount = op.Amount,
                        })
                        .ToList(),
                    IsCompleted = order.IsCompleted
                })
                .ToListAsync();
            return orders;
        }

        public async Task<InvalidOrdersDto> ValidateOrder(OrderDto order)
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
            return new InvalidOrdersDto { ProductIds = productIds, AddOnIds = addOnIds };
        }
    }
}
