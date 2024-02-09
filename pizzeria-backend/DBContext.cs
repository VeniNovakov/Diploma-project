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
        public DbSet<AddOn> AddOns { get; set; }
        public DbSet<AddOnsCategory> AddOnsCategory { get; set; }

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

            modelBuilder.Entity<AddOnsCategory>().HasData(
                new AddOnsCategory { Id = 1, Name = "Meat" },
                new AddOnsCategory { Id = 2, Name = "Veggies" },
                new AddOnsCategory { Id = 3, Name = "Cheeses" },
                new AddOnsCategory { Id = 4, Name = "Sauces" });

            modelBuilder.Entity<AddOnsCategory>().HasMany(cat => cat.AddOns).WithOne(addOn => addOn.Category).HasForeignKey(addon
                => addon.CategoryId).IsRequired();
        }

    }
}
