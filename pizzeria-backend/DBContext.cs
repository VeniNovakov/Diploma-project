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
        public DbSet<OrderedProduct> OrderedProducts { get; set; }
        public DbSet<OrderedAddOn> OrderedAddOns { get; set; }
        public DbSet<Order> Order { get; set; }

        public DbSet<User> Users { get; set; }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);


            modelBuilder.Entity<ProductsCategory>().HasData(
                new ProductsCategory { Id = 1, Name = "Pizza" },
                new ProductsCategory { Id = 2, Name = "Burger" },
                new ProductsCategory { Id = 3, Name = "Salad" },
                new ProductsCategory { Id = 4, Name = "Pasta" },
                new ProductsCategory { Id = 5, Name = "Rice" });

            modelBuilder.Entity<ProductsCategory>().HasMany(cat => cat.Products).WithOne(pr => pr.Category).HasForeignKey(pr => pr.CategoryId);


            modelBuilder.Entity<AddOnsCategory>().HasData(
                new AddOnsCategory { Id = 1, Name = "Meat" },
                new AddOnsCategory { Id = 2, Name = "Veggies" },
                new AddOnsCategory { Id = 3, Name = "Cheeses" },
                new AddOnsCategory { Id = 4, Name = "Sauces" });

            modelBuilder.Entity<AddOnsCategory>().HasMany(cat => cat.AddOns).WithOne(addOn => addOn.Category).HasForeignKey(addon
                => addon.CategoryId).IsRequired();

            modelBuilder.Entity<OrderedProduct>().HasMany(op => op.AddOns).WithOne(oa => oa.Product).HasForeignKey(oa => oa.ProductId);

            modelBuilder.Entity<OrderedProduct>().HasOne(op => op.Product).WithMany(pr => pr.OrderedProducts).HasForeignKey(op => op.ProductId);
            modelBuilder.Entity<OrderedAddOn>().HasOne(op => op.AddOn).WithMany(pr => pr.OrderedAddOns).HasForeignKey(op => op.AddOnId);

            modelBuilder.Entity<Order>().HasMany(ord => ord.OrderedProducts).WithOne(pr => pr.Order).HasForeignKey(op => op.OrderId);

        }

    }
}
