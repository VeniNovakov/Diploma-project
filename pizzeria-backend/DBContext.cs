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

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            //modelBuilder.Entity<Product>().HasMany(product => product.Category).WithOne(category => category.products);
        }

    }
}
