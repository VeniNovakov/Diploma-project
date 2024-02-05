using Microsoft.EntityFrameworkCore;
using pizzeria_backend.Models;
namespace pizzeria_backend
{
    public class AppDbContext : DbContext
    {
        public AppDbContext()
        {

        }

        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }
        public DbSet<ProductsCategory> ProductsCategories { get; set; }

        public DbSet<Product> Products { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);


            modelBuilder.Entity<ProductsCategory>().HasData(
                new ProductsCategory { Id = 1, Name = "Pizza" },
                new ProductsCategory { Id = 2, Name = "Burger" },
                new ProductsCategory { Id = 3, Name = "Salad" },
                new ProductsCategory { Id = 4, Name = "Pasta" },
                new ProductsCategory { Id = 5, Name = "Rice" });


            modelBuilder.Entity<ProductsCategory>().HasMany(cat => cat.Products).WithOne(pr => pr.Category);
        }

    }
}
