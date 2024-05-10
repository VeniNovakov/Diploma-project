using Microsoft.EntityFrameworkCore;
using pizzeria_backend.Models;

namespace pizzeria_backend
{
    public class AppDbContext : DbContext
    {
        public AppDbContext() { }

        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options) { }

        public DbSet<ProductsCategory> ProductsCategories { get; set; }
        public DbSet<Product> Products { get; set; }
        public DbSet<AddOnsCategory> AddOnsCategory { get; set; }
        public DbSet<AddOn> AddOns { get; set; }


        public DbSet<OrderedProduct> OrderedProducts { get; set; }
        public DbSet<OrderedAddOn> OrderedAddOns { get; set; }
        public DbSet<Order> Order { get; set; }

        public DbSet<User> Users { get; set; }

        public DbSet<Basket> Baskets { get; set; }
        public DbSet<BasketProduct> BasketProducts { get; set; }
        public DbSet<BasketAddOn> BasketAddOns { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            new DbInitializer(modelBuilder).Seed();

            modelBuilder
                .Entity<ProductsCategory>()
                .HasMany(cat => cat.Products)
                .WithOne(pr => pr.Category)
                .HasForeignKey(pr => pr.CategoryId);

            modelBuilder
                .Entity<AddOnsCategory>()
                .HasMany(cat => cat.AddOns)
                .WithOne(addOn => addOn.Category)
                .HasForeignKey(addon => addon.CategoryId)
                .IsRequired();

            modelBuilder
                .Entity<OrderedProduct>()
                .HasMany(op => op.AddOns)
                .WithOne(oa => oa.Product)
                .HasForeignKey(oa => oa.ProductId);

            modelBuilder
                .Entity<OrderedProduct>()
                .HasOne(op => op.Product)
                .WithMany(pr => pr.OrderedProducts)
                .HasForeignKey(op => op.ProductId);
            modelBuilder
                .Entity<OrderedAddOn>()
                .HasOne(op => op.AddOn)
                .WithMany(pr => pr.OrderedAddOns)
                .HasForeignKey(op => op.AddOnId);

            modelBuilder
                .Entity<Order>()
                .HasMany(ord => ord.OrderedProducts)
                .WithOne(pr => pr.Order)
                .HasForeignKey(op => op.OrderId);

            modelBuilder
                 .Entity<Order>()
                 .HasOne(ord => ord.User)
                 .WithMany(pr => pr.Orders)
                 .HasForeignKey(or => or.UserId);
            modelBuilder
                .Entity<BasketProduct>()
                .HasMany(op => op.AddOns)
                .WithOne(oa => oa.Product)
                .HasForeignKey(oa => oa.ProductId);

            modelBuilder
                .Entity<BasketProduct>()
                .HasOne(op => op.Product)
                .WithMany(pr => pr.BasketedProducts)
                .HasForeignKey(op => op.ProductId);

            modelBuilder
                .Entity<BasketAddOn>()
                .HasOne(op => op.AddOn)
                .WithMany(pr => pr.BasketedAddOns)
                .HasForeignKey(op => op.AddOnId);

            modelBuilder
                .Entity<Basket>()
                .HasMany(ord => ord.BasketProducts)
                .WithOne(pr => pr.Basket)
                .HasForeignKey(op => op.BasketId);
            modelBuilder
                .Entity<Basket>()
                .HasOne(bask => bask.User)
                .WithOne(user => user.Basket);
        }
    }
}
