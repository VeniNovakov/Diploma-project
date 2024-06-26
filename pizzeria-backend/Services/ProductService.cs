﻿using Microsoft.EntityFrameworkCore;
using pizzeria_backend.Models;
using pizzeria_backend.Services.Interfaces;

namespace pizzeria_backend.Services
{
    public class ProductService : IProductService
    {
        private readonly AppDbContext _context;

        public ProductService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<Product> AddProductAsync(Product product)
        {
            await _context.Products.AddAsync(product);
            await _context.SaveChangesAsync();

            return product;
        }

        public async Task<Product> GetProduct(int Id)
        {
            var product = await _context
                .Products.AsNoTracking()
                .Include(product => product.Category)
                .Where(product => product.Id == Id)
                .FirstAsync();

            return product;
        }

        public async Task<List<Product>> GetMenu()
        {
            var products = await _context
                .Products.Include(product => product.Category)
                .Where(product => product.IsInMenu)
                .ToListAsync();

            return products;
        }

        public async Task<List<Product>> GetAllProducts()
        {
            var products = await _context
                .Products.AsNoTracking()
                .Include(product => product.Category)
                .ToListAsync();

            return products;
        }

        public async Task<Product> UpdateProduct(Product product)
        {
            _context.Products.Update(product);

            await _context.SaveChangesAsync();

            return product;
        }

        public async Task<Product> DeleteProduct(int id)
        {
            var product = await _context.Products.FindAsync(id);
            if (product != null)
            {
                _context.Products.Remove(product);
                await _context.SaveChangesAsync();
            }

            return product;
        }
    }
}
