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

        public DbSet<Product> Products { get; set; }
        public DbSet<AddOn> AddOns { get; set; }
        public DbSet<AddOnsCategory> AddOnsCategory { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
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
