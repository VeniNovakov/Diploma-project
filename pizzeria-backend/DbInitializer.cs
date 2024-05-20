using Microsoft.EntityFrameworkCore;
using pizzeria_backend.Models;

namespace pizzeria_backend
{
    public class DbInitializer
    {
        private readonly ModelBuilder modelBuilder;

        public DbInitializer(ModelBuilder modelBuilder)
        {
            this.modelBuilder = modelBuilder;
        }

        public void Seed()
        {
            modelBuilder
                .Entity<ProductsCategory>()
                .HasData(
                    new ProductsCategory { Id = 1, Name = "Pizza" },
                    new ProductsCategory { Id = 2, Name = "Burger" },
                    new ProductsCategory { Id = 3, Name = "Salad" },
                    new ProductsCategory { Id = 4, Name = "Pasta" },
                    new ProductsCategory { Id = 5, Name = "Rice" }
                );

            modelBuilder
                .Entity<AddOnsCategory>()
                .HasData(
                    new AddOnsCategory { Id = 1, Name = "Meat" },
                    new AddOnsCategory { Id = 2, Name = "Veggies" },
                    new AddOnsCategory { Id = 3, Name = "Cheeses" },
                    new AddOnsCategory { Id = 4, Name = "Sauces" }
                );
        }
    }
}
