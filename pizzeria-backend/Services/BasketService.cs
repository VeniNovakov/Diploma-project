using Microsoft.EntityFrameworkCore;
using pizzeria_backend.Models;
using pizzeria_backend.Models.Interfaces;
using pizzeria_backend.Services.Interfaces;

namespace pizzeria_backend.Services
{
    public class BasketService : IBasketService
    {
        private readonly AppDbContext _context;

        public BasketService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<Basket> GetBasket(int userId)
        {
            var basket = await _context.Baskets
                .Where(basket => basket.UserId == userId)
                .Include(basket => basket.BasketProducts)
                    .ThenInclude(baskProduct => baskProduct.Product)
                    .ThenInclude(product => product.Category)
                 .Include(basket => basket.BasketProducts)
                    .ThenInclude(baskProduct => baskProduct.AddOns)
                .FirstOrDefaultAsync();

            return basket;
        }

        public async Task<BasketProduct> AddProduct(AddProductToBasketDto productDto, int userId)
        {
            Basket userBasket = await GetBasket(userId);

            if (userBasket == null)
            {
                userBasket = new Basket();
                userBasket.UserId = userId;
                await _context.Baskets.AddAsync(userBasket);
                await _context.SaveChangesAsync();
            }

            Product product = await _context.Products.FindAsync(productDto.Id);

            if (product == null || !product.IsInMenu || !product.IsAvailable)
            {
                throw new BadHttpRequestException("Invalid product provided");
            }

            var basketProduct = await _context.BasketProducts.Where(products => products.ProductId == product.Id && products.BasketId == userBasket.Id).FirstOrDefaultAsync();
            if (basketProduct != null)
            {
                basketProduct.Amount += 1;
                await _context.SaveChangesAsync();
                return basketProduct;
            }

            basketProduct = new BasketProduct
            {
                ProductId = product.Id,
                Product = product,
                Amount = productDto.Amount,
                BasketId = userBasket.Id
            };
            await _context.BasketProducts.AddAsync(basketProduct);

            if (productDto.AddOns != null && productDto.AddOns.Any())
            {
                foreach (var addOnDto in productDto.AddOns)
                {
                    AddOn addOn = await _context.AddOns.FindAsync(addOnDto.Id);

                    if (addOn != null)
                    {
                        var basketAddOn = new BasketAddOn
                        {
                            AddOnId = addOn.Id,
                            AddOn = addOn,
                            Amount = addOnDto.Amount,
                            ProductId = basketProduct.Id
                        };

                        await _context.BasketAddOns.AddAsync(basketAddOn);
                    }
                    else
                    {
                        throw new BadHttpRequestException("Invalid add-on provided");
                    }
                }
            }

            await _context.SaveChangesAsync();

            return basketProduct;
        }


        public async Task<BasketProduct> EditAmount(int productId, int userId, bool addToProduct)
        {




            BasketProduct bp = await _context.BasketProducts
                .Where(bp => bp.ProductId == productId && bp.Basket.UserId == userId)
                .FirstOrDefaultAsync();

            if (bp is null)
            {

                throw new BadHttpRequestException("product in basket nt found");
            }

            if (addToProduct == true)
            {
                bp.Amount += 1;
                _context.SaveChanges();
                return bp;

            }
            else
            {
                bp.Amount = bp.Amount <= 1 ? bp.Amount : bp.Amount - 1;
                _context.SaveChanges();
                return bp;
            }
        }


        public async Task RemoveProduct(int productId, int userId)
        {
            BasketProduct bp = await _context.BasketProducts
                .Where(bp => bp.ProductId == productId && bp.Basket.UserId == userId)
                .FirstOrDefaultAsync();

            if (bp == null)
            {
                throw new BadHttpRequestException("Invalid product provided");
            }

            _context.BasketProducts.Remove(bp);

            await _context.SaveChangesAsync();

        }
    }
}
